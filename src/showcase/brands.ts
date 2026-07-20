import type { Brand } from "react-tech-slider";

export const CORE_BRANDS = [
	{
		id: 1,
		name: "TypeScript",
		img: "https://cdn.simpleicons.org/typescript",
		width: 5,
		height: 5,
	},
	{
		id: 2,
		name: "React",
		img: "https://cdn.simpleicons.org/react",
		width: 5,
		height: 5,
	},
	{
		id: 3,
		name: "Vite",
		img: "https://cdn.simpleicons.org/vite",
		width: 5,
		height: 5,
	},
	{
		id: 4,
		name: "Node.js",
		img: "https://cdn.simpleicons.org/nodedotjs",
		width: 5,
		height: 5,
	},
	{
		id: 5,
		name: "GitHub",
		img: "https://cdn.simpleicons.org/github",
		width: 5,
		height: 5,
	},
	{
		id: 6,
		name: "pnpm",
		img: "https://cdn.simpleicons.org/pnpm",
		width: 5,
		height: 5,
	},
] as const satisfies readonly Brand[];

export const FRONTEND_BRANDS = [
	{
		id: 101,
		name: "Vue.js",
		img: "https://cdn.simpleicons.org/vuedotjs",
		width: 5,
		height: 5,
	},
	{
		id: 102,
		name: "Angular",
		img: "https://cdn.simpleicons.org/angular",
		width: 5,
		height: 5,
	},
	{
		id: 103,
		name: "Svelte",
		img: "https://cdn.simpleicons.org/svelte",
		width: 5,
		height: 5,
	},
	{
		id: 104,
		name: "Next.js",
		img: "https://cdn.simpleicons.org/nextdotjs",
		width: 5,
		height: 5,
	},
	{
		id: 105,
		name: "Tailwind CSS",
		img: "https://cdn.simpleicons.org/tailwindcss",
		width: 5,
		height: 5,
	},
	{
		id: 106,
		name: "Storybook",
		img: "https://cdn.simpleicons.org/storybook",
		width: 5,
		height: 5,
	},
] as const satisfies readonly Brand[];

export type BrandDatasetValidation =
	| { status: "valid"; brands: readonly Brand[] }
	| { status: "empty" }
	| { status: "invalid"; reason: string };

export function validateBrandDataset(
	brands: readonly Brand[],
): BrandDatasetValidation {
	if (brands.length === 0) return { status: "empty" };
	if (brands.length > 6) {
		return { status: "invalid", reason: "Brand datasets are limited to six items." };
	}

	const seenIds = new Set<number>();
	for (const brand of brands) {
		if (!Number.isFinite(brand.id)) {
			return { status: "invalid", reason: "Every brand ID must be finite." };
		}
		if (seenIds.has(brand.id)) {
			return { status: "invalid", reason: "Brand IDs must be unique." };
		}
		seenIds.add(brand.id);
		if (brand.name.trim() === "") {
			return { status: "invalid", reason: "Every brand needs a non-empty name." };
		}
		if (!isHttpsUrl(brand.img)) {
			return { status: "invalid", reason: "Every brand image must be an HTTPS URL." };
		}
	}

	return { status: "valid", brands };
}

function isHttpsUrl(value: string): boolean {
	try {
		return new URL(value).protocol === "https:";
	} catch {
		return false;
	}
}

const fallbackUrlCache = new Map<string, string>();

export function createBrandFallbackDataUrl(brand: Brand): string {
	const cacheKey = `${brand.id}\u0000${brand.name}`;
	const cached = fallbackUrlCache.get(cacheKey);
	if (cached) return cached;
	const name = escapeXml(brand.name.trim());
	const initials = escapeXml(createInitials(brand.name));
	const accent = stableAccent(brand);
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 96"><title>${name}</title><rect width="160" height="96" rx="16" fill="${accent}"/><text x="80" y="58" text-anchor="middle" font-family="sans-serif" font-size="38" fill="white">${initials}</text></svg>`;
	const url = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
	fallbackUrlCache.set(cacheKey, url);
	return url;
}

export function materializeFallbackBrands(
	brands: readonly Brand[],
): Brand[] {
	return brands.map((brand) => ({
		...brand,
		img: createBrandFallbackDataUrl(brand),
	}));
}

function createInitials(name: string): string {
	const initials = name
		.trim()
		.split(/\s+/)
		.map((part) => part.match(/[\p{L}\p{N}]/u)?.[0] ?? "")
		.filter(Boolean)
		.slice(0, 2)
		.join("")
		.toUpperCase();
	return initials || "?";
}

function escapeXml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");
}

function stableAccent(brand: Brand): string {
	const palette = ["#312e81", "#075985", "#166534", "#9a3412", "#86198f"];
	let hash = brand.id;
	for (const character of brand.name) hash = (hash * 31 + character.charCodeAt(0)) | 0;
	return palette[Math.abs(hash) % palette.length];
}
