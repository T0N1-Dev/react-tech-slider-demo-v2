import type { Brand, SliderProps } from "react-tech-slider";
import {
	type BrandDatasetValidation,
	validateBrandDataset,
} from "./brands";

export type SliderVariant = "running" | "fades";
export type ViewportPreset = "desktop" | "tablet" | "mobile";
export type DatasetId = "core" | "frontend";

export interface SharedSettings {
	datasetId: DatasetId;
	iconWidth: number;
}

export interface RunningSettings {
	borderWidth: number;
	borderColor: string;
	backgroundColor: string;
	isPlay: boolean;
	pauseOnHoverActive: boolean;
	durationMs: number;
}

export interface FadesSettings {
	gap: number;
	speed: number;
}

export interface PlaygroundState {
	variant: SliderVariant;
	viewport: ViewportPreset;
	shared: SharedSettings;
	running: RunningSettings;
	fades: FadesSettings;
}

export type ActiveSliderConfig =
	| {
			variant: "running";
			shared: SharedSettings;
			settings: RunningSettings;
	  }
	| {
			variant: "fades";
			shared: SharedSettings;
			settings: FadesSettings;
	  };

export interface NumericDomain {
	min: number;
	max: number;
	step: number;
}

export const NUMERIC_DOMAINS = {
	iconWidth: { min: 1, max: 10, step: 0.25 },
	borderWidth: { min: 0, max: 8, step: 1 },
	durationMs: { min: 5000, max: 120000, step: 1000 },
	gap: { min: 0, max: 180, step: 4 },
	speed: { min: 0.25, max: 4, step: 0.25 },
} as const satisfies Record<string, NumericDomain>;

export type NormalizationResult<T> = {
	value: T;
	status: "valid" | "corrected" | "invalid";
};

export function normalizeNumber(
	raw: unknown,
	domain: NumericDomain,
	previous: number,
): NormalizationResult<number> {
	if (typeof raw === "string" && raw.trim() === "") {
		return { value: previous, status: "invalid" };
	}

	const parsed = typeof raw === "number" ? raw : Number(raw);
	if (!Number.isFinite(parsed)) {
		return { value: previous, status: "invalid" };
	}

	const clamped = Math.min(domain.max, Math.max(domain.min, parsed));
	const stepsFromMinimum = Math.round((clamped - domain.min) / domain.step);
	const quantized = domain.min + stepsFromMinimum * domain.step;
	const precision = decimalPlaces(domain.step);
	const value = Number(quantized.toFixed(precision));

	return {
		value,
		status: value === parsed ? "valid" : "corrected",
	};
}

function normalizedValue(
	raw: unknown,
	domain: NumericDomain,
	previous: number,
): number {
	return normalizeNumber(raw, domain, previous).value;
}

export function normalizeColor(
	raw: string,
	previous: string,
	isValidColor: (candidate: string) => boolean,
): NormalizationResult<string> {
	const candidate = raw.trim();
	if (candidate === "" || !isValidColor(candidate)) {
		return { value: previous, status: "invalid" };
	}
	return { value: candidate, status: "valid" };
}

function normalizedColorValue(
	raw: string,
	previous: string,
	isValidColor: (candidate: string) => boolean,
): string {
	return normalizeColor(raw, previous, isValidColor).value;
}

function decimalPlaces(value: number): number {
	const text = String(value);
	return text.includes(".") ? text.length - text.indexOf(".") - 1 : 0;
}

export type PlaygroundAction =
	| { type: "SET_VARIANT"; value: SliderVariant }
	| { type: "SET_VIEWPORT"; value: ViewportPreset }
	| { type: "SET_DATASET"; value: DatasetId }
	| { type: "SET_ICON_WIDTH"; value: unknown }
	| { type: "SET_BORDER_WIDTH"; value: unknown }
	| { type: "SET_BORDER_COLOR"; value: string }
	| { type: "SET_BACKGROUND_COLOR"; value: string }
	| { type: "SET_RUNNING_PLAYBACK"; value: boolean }
	| { type: "SET_RUNNING_PAUSE_ON_HOVER"; value: boolean }
	| { type: "SET_DURATION_MS"; value: unknown }
	| { type: "SET_FADES_GAP"; value: unknown }
	| { type: "SET_FADES_SPEED"; value: unknown }
	| { type: "RESET_PLAYGROUND" };

export function createInitialState(reduceMotion: boolean): PlaygroundState {
	return {
		variant: "running",
		viewport: "desktop",
		shared: { datasetId: "core", iconWidth: 5 },
		running: {
			borderWidth: 1,
			borderColor: "#7c05d8",
			backgroundColor: "#00000033",
			isPlay: !reduceMotion,
			pauseOnHoverActive: false,
			durationMs: 30000,
		},
		fades: { gap: 48, speed: 1 },
	};
}

export function createPlaygroundReducer(
	initialState: PlaygroundState,
	isValidColor: (candidate: string) => boolean,
) {
	return (state: PlaygroundState, action: PlaygroundAction): PlaygroundState => {
		switch (action.type) {
			case "SET_VARIANT":
				return { ...state, variant: action.value };
			case "SET_VIEWPORT":
				return { ...state, viewport: action.value };
			case "SET_DATASET":
				return { ...state, shared: { ...state.shared, datasetId: action.value } };
			case "SET_ICON_WIDTH":
				return {
					...state,
					shared: {
						...state.shared,
						iconWidth: normalizedValue(
							action.value,
							NUMERIC_DOMAINS.iconWidth,
							state.shared.iconWidth,
						),
					},
				};
			case "SET_BORDER_WIDTH":
				return {
					...state,
					running: {
						...state.running,
						borderWidth: normalizedValue(
							action.value,
							NUMERIC_DOMAINS.borderWidth,
							state.running.borderWidth,
						),
					},
				};
			case "SET_BORDER_COLOR":
				return {
					...state,
					running: {
						...state.running,
						borderColor: normalizedColorValue(
							action.value,
							state.running.borderColor,
							isValidColor,
						),
					},
				};
			case "SET_BACKGROUND_COLOR":
				return {
					...state,
					running: {
						...state.running,
						backgroundColor: normalizedColorValue(
							action.value,
							state.running.backgroundColor,
							isValidColor,
						),
					},
				};
			case "SET_RUNNING_PLAYBACK":
				return {
					...state,
					running: { ...state.running, isPlay: action.value },
				};
			case "SET_RUNNING_PAUSE_ON_HOVER":
				return {
					...state,
					running: { ...state.running, pauseOnHoverActive: action.value },
				};
			case "SET_DURATION_MS":
				return {
					...state,
					running: {
						...state.running,
						durationMs: normalizedValue(
							action.value,
							NUMERIC_DOMAINS.durationMs,
							state.running.durationMs,
						),
					},
				};
			case "SET_FADES_GAP":
				return {
					...state,
					fades: {
						...state.fades,
						gap: normalizedValue(
							action.value,
							NUMERIC_DOMAINS.gap,
							state.fades.gap,
						),
					},
				};
			case "SET_FADES_SPEED":
				return {
					...state,
					fades: {
						...state.fades,
						speed: normalizedValue(
							action.value,
							NUMERIC_DOMAINS.speed,
							state.fades.speed,
						),
					},
				};
			case "RESET_PLAYGROUND":
				return cloneState(initialState);
		}
	};
}

function cloneState(state: PlaygroundState): PlaygroundState {
	return {
		...state,
		shared: { ...state.shared },
		running: { ...state.running },
		fades: { ...state.fades },
	};
}

export function getActiveConfig(state: PlaygroundState): ActiveSliderConfig {
	if (state.variant === "running") {
		return { variant: "running", shared: state.shared, settings: state.running };
	}
	return { variant: "fades", shared: state.shared, settings: state.fades };
}

export function selectDataset(
	datasetId: DatasetId,
	datasets: Readonly<Record<DatasetId, readonly Brand[]>>,
): readonly Brand[] {
	const dataset = datasets[datasetId];
	if (!dataset) throw new Error(`Unknown dataset: ${datasetId}`);
	return dataset;
}

export type PropSource = "always" | "omit-when-package-default";

export interface PropEntry<Name extends string, Value> {
	name: Name;
	value: Value;
	source: PropSource;
}

export type RunningPropEntry =
	| PropEntry<"iconWidth" | "borderWidth" | "durationMs", number>
	| PropEntry<"borderColor" | "backgroundColor", string>
	| PropEntry<"isPlay" | "pauseOnHoverActive", boolean>;

export type FadesPropEntry = PropEntry<"iconWidth" | "gap" | "speed", number>;

export type SliderInvocation =
	| {
			variant: "running";
			dataset: readonly Brand[];
			props: readonly RunningPropEntry[];
	  }
	| {
			variant: "fades";
			dataset: readonly Brand[];
			props: readonly FadesPropEntry[];
	  };

export function toPreviewProps(
	invocation: SliderInvocation,
	resolvedBrands: Brand[],
): SliderProps {
	const props: Record<string, unknown> = { brandsList: resolvedBrands };
	for (const entry of invocation.props) props[entry.name] = entry.value;
	if (invocation.variant === "fades") props.variant = "fades";
	return props as unknown as SliderProps;
}

const BRAND_GUIDANCE_CODE = `import { Slider, type Brand } from "react-tech-slider";

const brands: Brand[] = [
  { id: 1, name: "TypeScript", img: "https://cdn.simpleicons.org/typescript" },
];

<Slider brandsList={brands} iconWidth={5} />;
`;

export type InvocationResult =
	| { status: "ready"; invocation: SliderInvocation }
	| { status: "empty"; guidanceCode: string }
	| { status: "invalid"; reason: string; guidanceCode: string };

export function projectSlider(
	state: PlaygroundState,
	datasetInput: BrandDatasetValidation | readonly Brand[],
): InvocationResult {
	const validation = normalizeDatasetInput(datasetInput);
	if (validation.status === "empty") {
		return {
			status: "empty",
			guidanceCode: BRAND_GUIDANCE_CODE,
		};
	}
	if (validation.status === "invalid") {
		return {
			status: "invalid",
			reason: validation.reason,
			guidanceCode: BRAND_GUIDANCE_CODE,
		};
	}
	const dataset = validation.brands;
	const active = getActiveConfig(state);
	if (active.variant === "running") {
		return {
			status: "ready",
			invocation: {
				variant: "running",
				dataset,
				props: [
					{ name: "iconWidth", value: active.shared.iconWidth, source: "always" },
					{
						name: "borderWidth",
						value: active.settings.borderWidth,
						source: emissionRule(active.settings.borderWidth, 1),
					},
					{
						name: "borderColor",
						value: active.settings.borderColor,
						source: emissionRule(active.settings.borderColor, "#7c05d8"),
					},
					{
						name: "backgroundColor",
						value: active.settings.backgroundColor,
						source: emissionRule(active.settings.backgroundColor, "#00000033"),
					},
					{
						name: "isPlay",
						value: active.settings.isPlay,
						source: emissionRule(active.settings.isPlay, true),
					},
					{
						name: "pauseOnHoverActive",
						value: active.settings.pauseOnHoverActive,
						source: emissionRule(active.settings.pauseOnHoverActive, false),
					},
					{
						name: "durationMs",
						value: active.settings.durationMs,
						source: emissionRule(active.settings.durationMs, 30000),
					},
				],
			},
		};
	}

	return {
		status: "ready",
		invocation: {
			variant: "fades",
			dataset,
			props: [
				{ name: "iconWidth", value: active.shared.iconWidth, source: "always" },
				{ name: "gap", value: active.settings.gap, source: "always" },
				{
					name: "speed",
					value: active.settings.speed,
					source: emissionRule(active.settings.speed, 1),
				},
			],
		},
	};
}

function normalizeDatasetInput(
	input: BrandDatasetValidation | readonly Brand[],
): BrandDatasetValidation {
	return Array.isArray(input)
		? validateBrandDataset(input)
		: (input as BrandDatasetValidation);
}

function emissionRule<Value>(value: Value, packageDefault: Value): PropSource {
	return value === packageDefault ? "omit-when-package-default" : "always";
}
