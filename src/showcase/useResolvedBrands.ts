import type { Brand } from "react-tech-slider";
import { useCallback, useEffect, useRef, useState } from "react";
import { createBrandFallbackDataUrl } from "./brands";

type AssetStatus = "ready" | "failed";

export interface ResolvedBrandsResult {
	brands: Brand[];
	reportLateFailure: (url: string) => void;
}

export function useResolvedBrands(
	canonicalBrands: readonly Brand[],
): ResolvedBrandsResult {
	const uniqueUrlKey = JSON.stringify([
		...new Set(canonicalBrands.map(({ img }) => img)),
	]);
	const generationRef = useRef(0);
	const statusCacheRef = useRef(new Map<string, AssetStatus>());
	const [statuses, setStatuses] = useState<ReadonlyMap<string, AssetStatus>>(
		() => new Map(),
	);

	useEffect(() => {
		const generation = ++generationRef.current;
		let active = true;
		const urls = parseUrlKey(uniqueUrlKey).filter(
			(url) => !statusCacheRef.current.has(url),
		);

		const update = (url: string, status: AssetStatus) => {
			if (!active || generationRef.current !== generation) return;
			const currentStatus = statusCacheRef.current.get(url);
			if (currentStatus === "failed") return;
			statusCacheRef.current.set(url, status);
			setStatuses(new Map(statusCacheRef.current));
		};

		const images = urls.map((url) => {
			const image = new Image();
			image.onload = () => {
				try {
					const decodeResult = image.decode?.();
					Promise.resolve(decodeResult).then(
						() => update(url, "ready"),
						() => update(url, "failed"),
					);
				} catch {
					update(url, "failed");
				}
			};
			image.onerror = () => update(url, "failed");
			image.src = url;
			return image;
		});

		return () => {
			active = false;
			if (generationRef.current === generation) generationRef.current += 1;
			for (const image of images) {
				image.onload = null;
				image.onerror = null;
			}
		};
	}, [uniqueUrlKey]);

	const reportLateFailure = useCallback((url: string) => {
		if (
			url.startsWith("data:") ||
			statusCacheRef.current.get(url) !== "ready"
		) {
			return;
		}
		statusCacheRef.current.set(url, "failed");
		setStatuses(new Map(statusCacheRef.current));
	}, []);

	const brands = canonicalBrands.map((brand) => ({
		...brand,
		img:
			statuses.get(brand.img) === "ready"
				? brand.img
				: createBrandFallbackDataUrl(brand),
	}));

	return { brands, reportLateFailure };
}

function parseUrlKey(key: string): string[] {
	try {
		const parsed = JSON.parse(key) as unknown;
		return Array.isArray(parsed) &&
			parsed.every((value) => typeof value === "string")
			? parsed
			: [];
	} catch {
		return [];
	}
}
