import type { Brand } from "react-tech-slider";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	createBrandFallbackDataUrl,
	validateBrandDataset,
} from "./brands";
import { generateSliderCode } from "./codegen";
import { createInitialState, projectSlider } from "./model";
import { useResolvedBrands } from "./useResolvedBrands";

const BRANDS = [
	{
		id: 1,
		name: "TypeScript",
		img: "https://cdn.simpleicons.org/typescript",
		width: 6,
		height: 4,
	},
	{
		id: 2,
		name: "React",
		img: "https://cdn.simpleicons.org/react",
		height: 5,
	},
] satisfies Brand[];

interface FakeImageInstance {
	onload: ((event: Event) => void) | null;
	onerror: ((event: Event) => void) | null;
	src: string;
	decode: ReturnType<typeof vi.fn<() => Promise<void>>>;
}

let images: FakeImageInstance[];

beforeEach(() => {
	images = [];
	class FakeImage implements FakeImageInstance {
		onload: ((event: Event) => void) | null = null;
		onerror: ((event: Event) => void) | null = null;
		src = "";
		decode = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);

		constructor() {
			images.push(this);
		}
	}
	vi.stubGlobal("Image", FakeImage);
});

afterEach(() => vi.unstubAllGlobals());

async function loadImage(index: number) {
	await act(async () => {
		images[index].onload?.(new Event("load"));
		await Promise.resolve();
	});
}

function failImage(index: number) {
	act(() => images[index].onerror?.(new Event("error")));
}

function canonicalSource(brands: readonly Brand[]) {
	const result = projectSlider(
		createInitialState(false),
		validateBrandDataset(brands),
	);
	if (result.status !== "ready") throw new Error("Expected ready invocation");
	return generateSliderCode(result.invocation);
}

describe("useResolvedBrands", () => {
	it("uses fallbacks while pending and canonical URLs after successful preflight", async () => {
		const { result } = renderHook(() => useResolvedBrands(BRANDS));
		expect(result.current.brands).toEqual(
			BRANDS.map((brand) => ({
				...brand,
				img: createBrandFallbackDataUrl(brand),
			})),
		);
		expect(images.map(({ src }) => src)).toEqual(BRANDS.map(({ img }) => img));

		await loadImage(0);
		await loadImage(1);

		expect(images.every(({ decode }) => decode.mock.calls.length === 1)).toBe(true);
		expect(result.current.brands).toEqual(BRANDS);
	});

	it("keeps only one failed URL on fallback while another succeeds", async () => {
		const { result } = renderHook(() => useResolvedBrands(BRANDS));
		failImage(0);
		await loadImage(1);
		expect(result.current.brands[0].img).toBe(
			createBrandFallbackDataUrl(BRANDS[0]),
		);
		expect(result.current.brands[1].img).toBe(BRANDS[1].img);
	});

	it("keeps all failed URLs on stable fallbacks", () => {
		const { result } = renderHook(() => useResolvedBrands(BRANDS));
		failImage(0);
		failImage(1);
		expect(result.current.brands.map(({ img }) => img)).toEqual(
			BRANDS.map(createBrandFallbackDataUrl),
		);
	});

	it("treats decode rejection as terminal failure", async () => {
		const { result } = renderHook(() => useResolvedBrands([BRANDS[0]]));
		images[0].decode.mockRejectedValueOnce(new Error("decode failed"));
		await loadImage(0);
		expect(result.current.brands[0].img).toBe(
			createBrandFallbackDataUrl(BRANDS[0]),
		);
	});

	it("preflights each distinct canonical URL once", async () => {
		const duplicateUrlBrands = [
			BRANDS[0],
			{ ...BRANDS[1], img: BRANDS[0].img },
		] satisfies Brand[];
		const { result } = renderHook(() => useResolvedBrands(duplicateUrlBrands));
		expect(images).toHaveLength(1);
		await loadImage(0);
		expect(result.current.brands.map(({ img }) => img)).toEqual([
			BRANDS[0].img,
			BRANDS[0].img,
		]);
	});

	it("detaches stale callbacks and ignores a prior generation", async () => {
		const nextBrands = [
			{ id: 3, name: "Vite", img: "https://cdn.simpleicons.org/vite" },
		] satisfies Brand[];
		const { result, rerender } = renderHook(
			({ brands }) => useResolvedBrands(brands),
			{ initialProps: { brands: [BRANDS[0]] as readonly Brand[] } },
		);
		const staleLoad = images[0].onload;
		rerender({ brands: nextBrands });
		expect(images[0].onload).toBeNull();
		expect(images[0].onerror).toBeNull();
		expect(images).toHaveLength(2);

		await act(async () => {
			staleLoad?.(new Event("load"));
			await Promise.resolve();
		});
		expect(result.current.brands[0].img).toBe(
			createBrandFallbackDataUrl(nextBrands[0]),
		);
	});

	it("does not retry terminal failure when equivalent data rerenders", () => {
		const { result, rerender } = renderHook(
			({ brands }) => useResolvedBrands(brands),
			{ initialProps: { brands: [BRANDS[0]] as readonly Brand[] } },
		);
		failImage(0);
		rerender({ brands: [{ ...BRANDS[0] }] });
		expect(images).toHaveLength(1);
		expect(result.current.brands[0].img).toBe(
			createBrandFallbackDataUrl(BRANDS[0]),
		);
	});

	it("preflights each URL once across dataset round trips and never retries failure", async () => {
		const { result, rerender } = renderHook(
			({ brands }) => useResolvedBrands(brands),
			{ initialProps: { brands: [BRANDS[0]] as readonly Brand[] } },
		);
		failImage(0);
		rerender({ brands: [BRANDS[1]] });
		await loadImage(1);
		rerender({ brands: [BRANDS[0]] });
		expect(result.current.brands[0].img).toBe(
			createBrandFallbackDataUrl(BRANDS[0]),
		);
		rerender({ brands: [BRANDS[1]] });
		expect(result.current.brands[0].img).toBe(BRANDS[1].img);
		expect(images).toHaveLength(2);
	});

	it("preserves identity, order, and dimensions through pending and ready states", async () => {
		const { result } = renderHook(() => useResolvedBrands(BRANDS));
		const projectIdentity = (brands: readonly Brand[]) =>
			brands.map(({ id, name, width, height }) => ({ id, name, width, height }));
		expect(projectIdentity(result.current.brands)).toEqual(projectIdentity(BRANDS));
		await loadImage(0);
		await loadImage(1);
		expect(projectIdentity(result.current.brands)).toEqual(projectIdentity(BRANDS));
	});

	it("terminally replaces a late matching canonical-ready URL", async () => {
		const { result } = renderHook(() => useResolvedBrands([BRANDS[0]]));
		await loadImage(0);
		expect(result.current.brands[0].img).toBe(BRANDS[0].img);
		act(() => result.current.reportLateFailure(BRANDS[0].img));
		expect(result.current.brands[0].img).toBe(
			createBrandFallbackDataUrl(BRANDS[0]),
		);
		expect(images).toHaveLength(1);
	});

	it("ignores unrelated and already-fallback late failures", async () => {
		const { result } = renderHook(() => useResolvedBrands([BRANDS[0]]));
		await loadImage(0);
		act(() => {
			result.current.reportLateFailure("https://example.com/unrelated.svg");
			result.current.reportLateFailure(createBrandFallbackDataUrl(BRANDS[0]));
		});
		expect(result.current.brands[0].img).toBe(BRANDS[0].img);
	});

	it("never mutates canonical data or generated code during transport failures", () => {
		const sourceBefore = canonicalSource(BRANDS);
		const canonicalUrls = BRANDS.map(({ img }) => img);
		const { result } = renderHook(() => useResolvedBrands(BRANDS));
		failImage(0);
		failImage(1);
		expect(BRANDS.map(({ img }) => img)).toEqual(canonicalUrls);
		expect(canonicalSource(BRANDS)).toBe(sourceBefore);
		expect(sourceBefore).not.toContain("data:image/svg+xml");
		expect(result.current.brands.every(({ img }) => img.startsWith("data:"))).toBe(true);
	});
});
