import type { Brand } from "react-tech-slider";
import { describe, expect, it } from "vitest";
import {
	CORE_BRANDS,
	FRONTEND_BRANDS,
	createBrandFallbackDataUrl,
	materializeFallbackBrands,
	validateBrandDataset,
} from "./brands";

describe("canonical brand fixtures", () => {
	it.each([
		["core", CORE_BRANDS],
		["frontend", FRONTEND_BRANDS],
	] as const)("validates the %s fixture with bounded recognizable data", (_name, brands) => {
		expect(validateBrandDataset(brands)).toEqual({
			status: "valid",
			brands,
		});
		expect(brands).toHaveLength(6);
		expect(new Set(brands.map(({ id }) => id)).size).toBe(brands.length);
		expect(brands.every(({ id }) => Number.isFinite(id))).toBe(true);
		expect(brands.every(({ name }) => name.trim().length > 0)).toBe(true);
		expect(brands.every(({ img }) => img.startsWith("https://"))).toBe(true);
	});

	it("contains two distinct recognizable technology selections", () => {
		expect(CORE_BRANDS.map(({ name }) => name)).toEqual([
			"TypeScript",
			"React",
			"Vite",
			"Node.js",
			"GitHub",
			"pnpm",
		]);
		expect(FRONTEND_BRANDS.map(({ name }) => name)).toEqual([
			"Vue.js",
			"Angular",
			"Svelte",
			"Next.js",
			"Tailwind CSS",
			"Storybook",
		]);
	});
});

describe("brand validation", () => {
	const validBrand = {
		id: 1,
		name: "TypeScript",
		img: "https://cdn.simpleicons.org/typescript",
		width: 6,
		height: 4,
	} satisfies Brand;

	it("distinguishes empty data from invalid data", () => {
		expect(validateBrandDataset([])).toEqual({ status: "empty" });
	});

	it.each([
		[
			"duplicate IDs",
			[validBrand, { ...validBrand, name: "Duplicate" }],
			/unique/i,
		],
		["NaN ID", [{ ...validBrand, id: Number.NaN }], /finite/i],
		["infinite ID", [{ ...validBrand, id: Number.POSITIVE_INFINITY }], /finite/i],
		["blank name", [{ ...validBrand, name: "   " }], /name/i],
		["empty image", [{ ...validBrand, img: "" }], /https/i],
		["HTTP image", [{ ...validBrand, img: "http://example.com/logo.svg" }], /https/i],
		["malformed image", [{ ...validBrand, img: "https-not-a-url" }], /https/i],
		[
			"more than six brands",
			Array.from({ length: 7 }, (_, index) => ({
				...validBrand,
				id: index + 1,
				name: `Brand ${index + 1}`,
			})),
			/six/i,
		],
	] as const)("rejects %s", (_name, brands, reason) => {
		const result = validateBrandDataset(brands);
		expect(result.status).toBe("invalid");
		if (result.status !== "invalid") return;
		expect(result.reason).toMatch(reason);
	});

	it("preserves valid list identity, order, and dimensions", () => {
		const second = {
			id: 2,
			name: "React",
			img: "https://cdn.simpleicons.org/react",
			height: 7,
		} satisfies Brand;
		const brands = [validBrand, second] as const;
		const result = validateBrandDataset(brands);
		expect(result).toEqual({ status: "valid", brands });
		if (result.status !== "valid") return;
		expect(result.brands).toBe(brands);
		expect(result.brands.map(({ id }) => id)).toEqual([1, 2]);
		expect(result.brands[0]).toMatchObject({ width: 6, height: 4 });
		expect(result.brands[1]).toMatchObject({ height: 7 });
	});
});

describe("brand fallback data URLs", () => {
	it("creates a deterministic readable SVG data URL", () => {
		const brand = {
			id: 1,
			name: "TypeScript",
			img: "https://cdn.simpleicons.org/typescript",
		};
		const first = createBrandFallbackDataUrl(brand);
		expect(createBrandFallbackDataUrl(brand)).toBe(first);
		expect(first).toMatch(/^data:image\/svg\+xml/);
		expect(decodeURIComponent(first)).toContain("TypeScript");
		expect(decodeURIComponent(first)).toContain(">T<");
	});

	it("escapes readable names and creates initials for multiple brands", () => {
		const brands = [
			{ id: 1, name: "React Tools", img: "https://example.com/react.svg" },
			{ id: 2, name: "R&D <Tools>", img: "https://example.com/tools.svg" },
		] satisfies Brand[];
		const materialized = materializeFallbackBrands(brands);
		expect(materialized).toHaveLength(2);
		expect(decodeURIComponent(materialized[0].img)).toContain(">RT<");
		expect(decodeURIComponent(materialized[1].img)).toContain(
			"R&amp;D &lt;Tools&gt;",
		);
	});

	it("replaces only URLs while preserving identity, order, and dimensions", () => {
		const brands = [
			{
				id: 9,
				name: "First",
				img: "https://example.com/first.svg",
				width: 6,
				height: 4,
			},
			{
				id: 10,
				name: "Second",
				img: "https://example.com/second.svg",
				height: 5,
			},
		] satisfies Brand[];
		const materialized = materializeFallbackBrands(brands);
		expect(materialized.map(({ id, name, width, height }) => ({
			id,
			name,
			width,
			height,
		}))).toEqual([
			{ id: 9, name: "First", width: 6, height: 4 },
			{ id: 10, name: "Second", width: undefined, height: 5 },
		]);
		expect(materialized.every(({ img }) => img.startsWith("data:image/svg+xml"))).toBe(true);
	});
});
