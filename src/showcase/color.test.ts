import { describe, expect, expectTypeOf, it } from "vitest";
import {
	resolveCssColor,
	type CssColorBrowserBoundary,
	type CssColorResolver,
	type ResolvedCssColor,
} from "./color";

interface BoundaryOptions {
	computed?: string;
	first?: readonly number[] | null;
	second?: readonly number[] | null;
	resolve?: "null" | "throw";
	sample?: "throw";
	remove?: "throw";
}

function createBoundary(options: BoundaryOptions = {}) {
	const calls = {
		candidates: [] as string[],
		samples: [] as Array<{ color: string; sentinel: string }>,
		removals: 0,
	};
	const first =
		options.first === undefined ? [102, 51, 153, 255] : options.first;
	const second = options.second === undefined ? first : options.second;

	const boundary: CssColorBrowserBoundary = {
		resolveConcreteColor(candidate: string) {
			calls.candidates.push(candidate);
			if (options.resolve === "throw") {
				throw new Error("probe failed");
			}
			if (options.resolve === "null") {
				return null;
			}
			return {
				color: options.computed ?? "rgb(102, 51, 153)",
				remove() {
					calls.removals += 1;
					if (options.remove === "throw") {
						throw new Error("cleanup failed");
					}
				},
			};
		},
		sampleSrgb(color: string, sentinel: string) {
			calls.samples.push({ color, sentinel });
			if (options.sample === "throw") {
				throw new Error("readback failed");
			}
			return calls.samples.length === 1 ? first : second;
		},
	};

	return { boundary, calls };
}

describe("resolveCssColor", () => {
	it("exposes the canonical and picker resolver contract", () => {
		expectTypeOf<ResolvedCssColor>().toEqualTypeOf<{
			canonical: string;
			pickerHex: string;
		}>();
		expectTypeOf(resolveCssColor).toMatchTypeOf<CssColorResolver>();
	});

	it.each([
		["#abc", "#aabbccff"],
		["#AbC7", "#aabbcc77"],
		["#123456", "#123456ff"],
		["#ABCDEF00", "#abcdef00"],
		["#00000033", "#00000033"],
		["#abcdefFF", "#abcdefff"],
	])("fast-paths %s while preserving its trimmed canonical form", (candidate, pickerHex) => {
		const result = resolveCssColor(`  ${candidate}  `, {
			resolveConcreteColor() {
				throw new Error("hex must not use the browser boundary");
			},
			sampleSrgb() {
				throw new Error("hex must not use canvas sampling");
			},
		});

		expect(result).toEqual({ canonical: candidate, pickerHex });
		expect(result?.pickerHex).toMatch(/^#[0-9a-f]{8}$/);
	});

	it.each([
		["rebeccapurple", "rgb(102, 51, 153)", [102, 51, 153, 255], "#663399ff"],
		["transparent", "rgba(0, 0, 0, 0)", [0, 0, 0, 0], "#00000000"],
		[
			"rgb(10 20 30 / 20%)",
			"rgba(10, 20, 30, 0.2)",
			[10, 20, 30, 51],
			"#0a141e33",
		],
		["hsl(120 100% 25%)", "rgb(0, 128, 0)", [0, 128, 0, 255], "#008000ff"],
		[
			"color(display-p3 1 0.5 0)",
			"color(srgb 1 0.46 0)",
			[255, 117, 0, 255],
			"#ff7500ff",
		],
	])("preserves concrete %s and projects its sampled sRGB bytes", (candidate, computed, bytes, pickerHex) => {
		const { boundary, calls } = createBoundary({ computed, first: bytes });

		expect(resolveCssColor(` ${candidate} `, boundary)).toEqual({
			canonical: candidate,
			pickerHex,
		});
		expect(calls.candidates).toEqual([candidate]);
		expect(calls.samples).toHaveLength(2);
		expect(calls.samples[0]?.color).toBe(computed);
		expect(calls.samples[1]?.color).toBe(computed);
		expect(calls.samples[0]?.sentinel).not.toBe(calls.samples[1]?.sentinel);
		expect(calls.removals).toBe(1);
	});

	it("rounds finite projected channels and pads every byte", () => {
		const { boundary } = createBoundary({ first: [0.4, 8.5, 15.49, 254.5] });

		expect(resolveCssColor("round-me", boundary)).toEqual({
			canonical: "round-me",
			pickerHex: "#00090fff",
		});
	});

	it.each([
		"",
		"   ",
		"currentColor",
		"CURRENTCOLOR",
		"inherit",
		"initial",
		"unset",
		"revert",
		"revert-layer",
		"var(--brand)",
		"rgb(var(--channels))",
	])("rejects context-dependent input %j before touching the browser", (candidate) => {
		const { boundary, calls } = createBoundary({ resolve: "throw" });

		expect(resolveCssColor(candidate, boundary)).toBeNull();
		expect(calls.candidates).toEqual([]);
	});

	it.each([
		"not-a-color",
		"#12",
		"#abcdz",
		"url(https://example.test/color.png)",
	])("returns null when the probe cannot resolve %s", (candidate) => {
		const { boundary, calls } = createBoundary({ resolve: "null" });

		expect(resolveCssColor(candidate, boundary)).toBeNull();
		expect(calls.samples).toEqual([]);
		expect(calls.removals).toBe(0);
	});

	it.each([
		"canvas unavailable",
		"2d context unavailable",
		"readback unavailable",
	])("returns null and cleans up when %s", () => {
		const { boundary, calls } = createBoundary({ first: null });

		expect(resolveCssColor("rebeccapurple", boundary)).toBeNull();
		expect(calls.removals).toBe(1);
	});

	it("returns null and cleans up when readback throws", () => {
		const { boundary, calls } = createBoundary({ sample: "throw" });

		expect(resolveCssColor("rebeccapurple", boundary)).toBeNull();
		expect(calls.removals).toBe(1);
	});

	it.each([
		[
			[102, 51, 153, 255],
			[102, 51, 154, 255],
		],
		[
			[-1, 51, 153, 255],
			[-1, 51, 153, 255],
		],
		[
			[102, Number.NaN, 153, 255],
			[102, Number.NaN, 153, 255],
		],
		[
			[102, 51, 153],
			[102, 51, 153],
		],
	])("rejects sentinel disagreement or unusable sample bytes", (first, second) => {
		const { boundary, calls } = createBoundary({ first, second });

		expect(resolveCssColor("rebeccapurple", boundary)).toBeNull();
		expect(calls.removals).toBe(1);
	});

	it("contains assignment/probe failures without sampling", () => {
		const { boundary, calls } = createBoundary({ resolve: "throw" });

		expect(resolveCssColor("rebeccapurple", boundary)).toBeNull();
		expect(calls.samples).toEqual([]);
		expect(calls.removals).toBe(0);
	});

	it("contains cleanup failures instead of leaking a projected value", () => {
		const { boundary, calls } = createBoundary({ remove: "throw" });

		expect(resolveCssColor("rebeccapurple", boundary)).toBeNull();
		expect(calls.removals).toBe(1);
	});

	it("uses only the injected probe and sRGB sampling boundary", () => {
		const { boundary, calls } = createBoundary();

		const result = resolveCssColor("remote-free-color", boundary);

		expect(result?.pickerHex).toMatch(/^#[0-9a-f]{8}$/);
		expect(calls).toEqual({
			candidates: ["remote-free-color"],
			samples: [
				{ color: "rgb(102, 51, 153)", sentinel: calls.samples[0]?.sentinel },
				{ color: "rgb(102, 51, 153)", sentinel: calls.samples[1]?.sentinel },
			],
			removals: 1,
		});
	});
});
