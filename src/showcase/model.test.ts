import type { Brand } from "react-tech-slider";
import { describe, expect, it } from "vitest";
import { validateBrandDataset } from "./brands";
import {
	NUMERIC_DOMAINS,
	createInitialState,
	createPlaygroundReducer,
	getActiveConfig,
	normalizeColor,
	normalizeNumber,
	projectSlider,
	selectDataset,
} from "./model";

const CORE_BRANDS = [
	{
		id: 1,
		name: "TypeScript",
		img: "https://example.com/typescript.svg",
	},
	{
		id: 2,
		name: "React",
		img: "https://example.com/react.svg",
	},
] satisfies Brand[];

const FRONTEND_BRANDS = [
	{
		id: 3,
		name: "Vite",
		img: "https://example.com/vite.svg",
	},
] satisfies Brand[];

const DATASETS = {
	core: CORE_BRANDS,
	frontend: FRONTEND_BRANDS,
};

const isValidColor = (candidate: string) =>
	[
		"#00000033",
		"#7c05d8",
		"oklch(70% 0.15 250)",
		"rebeccapurple",
		"transparent",
	].includes(candidate);

const NUMERIC_CASES = [
	["iconWidth", 5, 1, 10, 0, 11, 1.13, 1.25],
	["borderWidth", 1, 0, 8, -1, 9, 3.4, 3],
	["durationMs", 30000, 5000, 120000, 4999, 120001, 5555, 6000],
	["gap", 48, 0, 180, -1, 181, 51, 52],
	["speed", 1, 0.25, 4, 0, 5, 1.13, 1.25],
] as const;

const NORMALIZATION_MATRIX = NUMERIC_CASES.flatMap(
	([domain, previous, minimum, maximum, below, above, stepped, quantized]) => [
		[domain, "minimum", minimum, previous, minimum],
		[domain, "maximum", maximum, previous, maximum],
		[domain, "empty", "", previous, previous],
		[domain, "NaN", Number.NaN, previous, previous],
		[domain, "Infinity", Number.POSITIVE_INFINITY, previous, previous],
		[domain, "below", below, previous, minimum],
		[domain, "above", above, previous, maximum],
		[domain, "step", stepped, previous, quantized],
	] as const,
);

describe("numeric normalization", () => {
	it.each(NORMALIZATION_MATRIX)(
		"normalizes %s %s input",
		(domainName, _caseName, raw, previous, expected) => {
			expect(
				normalizeNumber(raw, NUMERIC_DOMAINS[domainName], previous).value,
			).toBe(expected);
		},
	);

	it("reports invalid and corrected input without admitting unsafe values", () => {
		expect(normalizeNumber("", NUMERIC_DOMAINS.iconWidth, 5)).toEqual({
			value: 5,
			status: "invalid",
		});
		expect(normalizeNumber(99, NUMERIC_DOMAINS.iconWidth, 5)).toEqual({
			value: 10,
			status: "corrected",
		});
		expect(normalizeNumber(5, NUMERIC_DOMAINS.iconWidth, 4)).toEqual({
			value: 5,
			status: "valid",
		});
	});
});

describe("color normalization", () => {
	it("accepts alpha-bearing hex and non-hex CSS colors", () => {
		expect(normalizeColor("#00000033", "black", isValidColor)).toEqual({
			value: "#00000033",
			status: "valid",
		});
		expect(
			normalizeColor(" oklch(70% 0.15 250) ", "black", isValidColor),
		).toEqual({ value: "oklch(70% 0.15 250)", status: "valid" });
	});

	it.each(["", "not-a-color"])(
		"preserves the prior valid color for %j",
		(raw) => {
			expect(normalizeColor(raw, "#7c05d8", isValidColor)).toEqual({
				value: "#7c05d8",
				status: "invalid",
			});
		},
	);
});

describe("playground state", () => {
	it("documents defaults and only pauses running for reduced motion", () => {
		expect(createInitialState(false)).toEqual({
			variant: "running",
			viewport: "desktop",
			shared: { datasetId: "core", iconWidth: 5 },
			running: {
				borderWidth: 1,
				borderColor: "#7c05d8",
				backgroundColor: "#00000033",
				isPlay: true,
				pauseOnHoverActive: false,
				durationMs: 30000,
			},
			fades: { gap: 48, speed: 1 },
		});
		expect(createInitialState(true)).toEqual({
			...createInitialState(false),
			running: { ...createInitialState(false).running, isPlay: false },
		});
	});

	it("selects only a known dataset", () => {
		expect(selectDataset("core", DATASETS)).toBe(CORE_BRANDS);
		expect(selectDataset("frontend", DATASETS)).toBe(FRONTEND_BRANDS);
	});

	it("uses field-specific actions and preserves separate stores on round trips", () => {
		const initial = createInitialState(false);
		const reduce = createPlaygroundReducer(initial, isValidColor);
		let state = reduce(initial, { type: "SET_ICON_WIDTH", value: 7.12 });
		state = reduce(state, { type: "SET_BORDER_WIDTH", value: 4 });
		state = reduce(state, { type: "SET_BORDER_COLOR", value: "rebeccapurple" });
		state = reduce(state, { type: "SET_BACKGROUND_COLOR", value: "transparent" });
		state = reduce(state, { type: "SET_RUNNING_PLAYBACK", value: false });
		state = reduce(state, { type: "SET_RUNNING_PAUSE_ON_HOVER", value: true });
		state = reduce(state, { type: "SET_DURATION_MS", value: 45001 });
		state = reduce(state, { type: "SET_VARIANT", value: "fades" });
		state = reduce(state, { type: "SET_FADES_GAP", value: 74 });
		state = reduce(state, { type: "SET_FADES_SPEED", value: 2.6 });
		state = reduce(state, { type: "SET_DATASET", value: "frontend" });
		state = reduce(state, { type: "SET_VIEWPORT", value: "mobile" });

		expect(state).toEqual({
			variant: "fades",
			viewport: "mobile",
			shared: { datasetId: "frontend", iconWidth: 7 },
			running: {
				borderWidth: 4,
				borderColor: "rebeccapurple",
				backgroundColor: "transparent",
				isPlay: false,
				pauseOnHoverActive: true,
				durationMs: 45000,
			},
			fades: { gap: 76, speed: 2.5 },
		});

		state = reduce(state, { type: "SET_VARIANT", value: "running" });
		expect(getActiveConfig(state)).toEqual({
			variant: "running",
			shared: state.shared,
			settings: state.running,
		});
		state = reduce(state, { type: "SET_VARIANT", value: "fades" });
		expect(getActiveConfig(state)).toEqual({
			variant: "fades",
			shared: state.shared,
			settings: state.fades,
		});
	});

	it("rejects invalid color commits before canonical state and invocation", () => {
		const initial = createInitialState(false);
		const reduce = createPlaygroundReducer(initial, isValidColor);
		let state = reduce(initial, {
			type: "SET_BORDER_COLOR",
			value: "not-a-color",
		});
		state = reduce(state, { type: "SET_BACKGROUND_COLOR", value: "" });
		expect(state.running.borderColor).toBe("#7c05d8");
		expect(state.running.backgroundColor).toBe("#00000033");

		const result = projectSlider(state, CORE_BRANDS);
		if (result.status !== "ready") throw new Error("Expected ready invocation");
		expect(
			Object.fromEntries(
				result.invocation.props.map(({ name, value }) => [name, value]),
			),
		).toMatchObject({
			borderColor: "#7c05d8",
			backgroundColor: "#00000033",
		});
	});

	it("atomically resets to the captured reduced-motion initial state", () => {
		const initial = createInitialState(true);
		const reduce = createPlaygroundReducer(initial, isValidColor);
		const changed = reduce(initial, { type: "SET_FADES_SPEED", value: 4 });
		expect(reduce(changed, { type: "RESET_PLAYGROUND" })).toEqual(initial);
	});
});

describe("canonical slider invocation", () => {
	it("bypasses ready invocation for empty and invalid brand validation", () => {
		const state = createInitialState(false);
		const empty = projectSlider(state, validateBrandDataset([]));
		expect(empty.status).toBe("empty");
		if (empty.status !== "empty") return;
		expect(empty.guidanceCode).toContain('from "react-tech-slider"');
		expect(empty.guidanceCode).toContain("brandsList={brands}");
		const invalid = validateBrandDataset([
			CORE_BRANDS[0],
			{ ...CORE_BRANDS[1], id: CORE_BRANDS[0].id },
		]);
		const result = projectSlider(state, invalid);
		expect(result.status).toBe("invalid");
		if (result.status !== "invalid") return;
		expect(result.reason).toMatch(/unique/i);
	});

	it("keeps validated canonical data in a ready invocation", () => {
		const validation = validateBrandDataset(CORE_BRANDS);
		const result = projectSlider(createInitialState(false), validation);
		expect(result.status).toBe("ready");
		if (result.status !== "ready") return;
		expect(result.invocation.dataset).toBe(CORE_BRANDS);
	});

	it("projects the default running settings into exact public entries", () => {
		const result = projectSlider(createInitialState(false), CORE_BRANDS);
		expect(result.status).toBe("ready");
		if (result.status !== "ready") return;
		expect(result.invocation.variant).toBe("running");
		expect(
			Object.fromEntries(
				result.invocation.props.map(({ name, value }) => [name, value]),
			),
		).toEqual({
			iconWidth: 5,
			borderWidth: 1,
			borderColor: "#7c05d8",
			backgroundColor: "#00000033",
			isPlay: true,
			pauseOnHoverActive: false,
			durationMs: 30000,
		});
	});

	it("projects exact exhaustive running keys and no obsolete or fades keys", () => {
		const state = createInitialState(false);
		const result = projectSlider(state, CORE_BRANDS);
		if (result.status !== "ready") throw new Error("Expected ready invocation");
		expect(result.invocation.props.map(({ name }) => name)).toEqual([
			"iconWidth",
			"borderWidth",
			"borderColor",
			"backgroundColor",
			"isPlay",
			"pauseOnHoverActive",
			"durationMs",
		]);
		expect(result.invocation.props.map(({ name }) => name)).not.toEqual(
			expect.arrayContaining(["speed", "autoPlay", "pauseOnHover"]),
		);
	});

	it("projects the fades discriminant and exact allowed entries", () => {
		const state = { ...createInitialState(false), variant: "fades" as const };
		const result = projectSlider(state, CORE_BRANDS);
		if (result.status !== "ready") throw new Error("Expected ready invocation");
		expect(result.invocation.variant).toBe("fades");
		expect(result.invocation.dataset).toBe(CORE_BRANDS);
		expect(result.invocation.props).toEqual([
			{ name: "iconWidth", value: 5, source: "always" },
			{ name: "gap", value: 48, source: "always" },
			{ name: "speed", value: 1, source: "omit-when-package-default" },
		]);
	});
});
