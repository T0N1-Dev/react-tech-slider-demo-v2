import type { Brand } from "react-tech-slider";
import { describe, expect, it } from "vitest";
import {
	CORE_BRANDS,
	FOOD_BRANDS,
	MAX_DATASET_SIZE,
	SPORT_BRANDS,
	createBrandFallbackDataUrl,
	materializeFallbackBrands,
	validateBrandDataset,
} from "./brands";

const transition = { transition: "width 1s ease" };
const sportStyle = { transition: "width 1s ease", filter: "invert()" };
const expectedSport = [
	{ id: 1, name: "Puma", img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1744835609/puma-logo-logo-svgrepo-com_ylvldf.svg", style: sportStyle, className: "puma-icon" },
	{ id: 2, name: "Reebok", img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1744835608/reebok-crossfit_ger10e.svg", style: sportStyle, className: "reebok-icon" },
	{ id: 3, name: "Under Armour", img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1744835607/under-armour_ddci89.svg", style: sportStyle, className: "under-armour" },
	{ id: 4, name: "The North Face", img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1744835607/the-north-face_jql7qf.svg", style: sportStyle, className: "northFace-icon" },
	{ id: 5, name: "Nike", img: "https://img.icons8.com/ios-filled/500/nike.png", style: sportStyle },
	{ id: 6, name: "Adidas", img: "https://img.icons8.com/ios-filled/500/adidas-trefoil.png", style: sportStyle },
	{ id: 7, name: "Fila", img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111679/fila-svgrepo-com_nitwjq.svg", style: sportStyle },
] satisfies Brand[];
const expectedFood = [
	{ id: 1, name: "Papa Johns", img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111637/papa_dojmtq.svg", style: transition },
	{ id: 2, name: "Burger King", img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111638/burger-king_eyaxzl.svg", style: transition },
	{ id: 3, name: "SubWay", img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111637/subway_mtrhua.svg", style: transition },
	{ id: 4, name: "Oreo", img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111636/oreo_vfrh58.svg", style: transition },
	{ id: 5, name: "McDonalds", img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111635/mcdonalds_g2tuh2.svg", style: transition },
	{ id: 6, name: "KFC", img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111635/kfc_q9irnf.svg", style: transition },
	{ id: 7, name: "StarBucks", img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111635/starbucks_b4obmn.svg", style: transition },
	{ id: 8, name: "Fritos", img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111635/fritos_yuzj8p.svg", style: transition },
	{ id: 9, name: "Dunkin`Donuts", img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111633/dunkin-donuts_kiwq2h.svg", style: transition },
	{ id: 10, name: "Domino`s Pizza", img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111633/dominos-pizza_wddklm.svg", style: transition },
] satisfies Brand[];

describe("canonical brand fixtures", () => {
	it("matches the exact approved Core, Sport, and Food records", () => {
		expect(CORE_BRANDS).toEqual([
			{ id: 1, name: "TypeScript", img: "https://cdn.simpleicons.org/typescript" },
			{ id: 2, name: "React", img: "https://cdn.simpleicons.org/react" },
			{ id: 3, name: "npm", img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1785109501/idTOrUuxMp_1785109477561_igg5qy.png" },
			{ id: 4, name: "css", img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1746640784/purple-css-logo_xufnis.webp" },
			{ id: 5, name: "GitHub", img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1739393991/github_ualv1s.png" },
			{ id: 6, name: "pnpm", img: "https://cdn.simpleicons.org/pnpm" },
		]);
		expect(SPORT_BRANDS).toEqual(expectedSport);
		expect(FOOD_BRANDS).toEqual(expectedFood);
		expect(MAX_DATASET_SIZE).toBe(10);
	});

	it.each([["core", CORE_BRANDS], ["sport", SPORT_BRANDS], ["food", FOOD_BRANDS]] as const)(
		"validates the exact %s fixture without normalizing it",
		(_name, brands) => expect(validateBrandDataset(brands)).toEqual({ status: "valid", brands }),
	);
});

describe("brand validation", () => {
	const validBrand = { id: 1, name: "TypeScript", img: "https://cdn.simpleicons.org/typescript", width: 6, height: 4 } satisfies Brand;
	const list = (length: number) => Array.from({ length }, (_, index) => ({ ...validBrand, id: index + 1 }));

	it("accepts one and ten records, distinguishes empty data, and rejects eleven", () => {
		expect(validateBrandDataset([])).toEqual({ status: "empty" });
		expect(validateBrandDataset(list(1)).status).toBe("valid");
		expect(validateBrandDataset(list(10)).status).toBe("valid");
		expect(validateBrandDataset(list(11))).toEqual({ status: "invalid", reason: "Brand datasets are limited to ten items." });
	});

	it("scopes duplicate IDs to each independently validated list", () => {
		expect(validateBrandDataset(SPORT_BRANDS).status).toBe("valid");
		expect(validateBrandDataset(FOOD_BRANDS).status).toBe("valid");
		expect(validateBrandDataset([validBrand, { ...validBrand, name: "Duplicate" }]).status).toBe("invalid");
	});

	it.each([
		["NaN ID", [{ ...validBrand, id: Number.NaN }], /finite/i],
		["infinite ID", [{ ...validBrand, id: Number.POSITIVE_INFINITY }], /finite/i],
		["blank name", [{ ...validBrand, name: "   " }], /name/i],
		["HTTP image", [{ ...validBrand, img: "http://example.com/logo.svg" }], /https/i],
		["NaN width", [{ ...validBrand, width: Number.NaN }], /width/i],
		["infinite height", [{ ...validBrand, height: Number.POSITIVE_INFINITY }], /height/i],
		["non-string class", [{ ...validBrand, className: 1 }], /className/i],
		["null style", [{ ...validBrand, style: null }], /style/i],
		["array style", [{ ...validBrand, style: [] }], /style/i],
		["object style value", [{ ...validBrand, style: { width: {} } }], /style/i],
		["non-finite style value", [{ ...validBrand, style: { width: Number.NaN } }], /style/i],
	] as const)("rejects %s", (_name, brands, reason) => {
		const result = validateBrandDataset(brands as unknown as readonly Brand[]);
		expect(result.status).toBe("invalid");
		if (result.status === "invalid") expect(result.reason).toMatch(reason);
	});

	it("preserves the original list, record order, dimensions, and serializable metadata", () => {
		const brands = [
			{ ...validBrand, style: {}, className: "Case-Sensitive" },
			{ id: 2, name: "React", img: "https://cdn.simpleicons.org/react", style: { width: "2rem", zIndex: 3 } },
		] satisfies Brand[];
		const result = validateBrandDataset(brands);
		expect(result).toEqual({ status: "valid", brands });
		if (result.status !== "valid") return;
		expect(result.brands).toBe(brands);
		expect(result.brands[0]).toBe(brands[0]);
		expect(result.brands[1]).toBe(brands[1]);
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

	it("changes only img while preserving canonical records, order, dimensions, and metadata", () => {
		const brands = [
			{ id: 9, name: "First", img: "https://example.com/first.svg", width: 6, height: 4, style: { transition: "width 1s ease" }, className: "Exact-Case" },
			{ id: 10, name: "Second", img: "https://example.com/second.svg", style: { width: "2rem", zIndex: 3 } },
		] satisfies Brand[];
		const materialized = materializeFallbackBrands(brands);
		expect(materialized).toHaveLength(brands.length);
		materialized.forEach((brand, index) => expect(brand).toEqual({ ...brands[index], img: brand.img }));
		expect(materialized.every(({ img }) => img.startsWith("data:image/svg+xml"))).toBe(true);
		expect(brands.map(({ img }) => img)).toEqual(["https://example.com/first.svg", "https://example.com/second.svg"]);
	});
});
