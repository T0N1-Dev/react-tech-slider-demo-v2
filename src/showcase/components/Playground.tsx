import type { Brand } from "react-tech-slider";
import type { ComponentType } from "react";
import { useLayoutEffect, useMemo, useReducer, useRef, useState } from "react";
import {
	CORE_BRANDS,
	FOOD_BRANDS,
	SPORT_BRANDS,
	validateBrandDataset,
} from "../brands";
import { resolveCssColor, type CssColorResolver } from "../color";
import { generateSliderCode } from "../codegen";
import {
	createInitialState,
	createPlaygroundReducer,
	projectSlider,
	selectDataset,
	type DatasetId,
} from "../model";
import { ControlPanel } from "./ControlPanel";
import { GeneratedCode } from "./GeneratedCode";
import { PreviewPanel, type PreviewPanelProps } from "./PreviewPanel";

const DEFAULT_DATASETS = {
	core: CORE_BRANDS,
	sport: SPORT_BRANDS,
	food: FOOD_BRANDS,
} as const satisfies Readonly<Record<DatasetId, readonly Brand[]>>;

export type PlaygroundPreviewProps = PreviewPanelProps;

interface PlaygroundProps {
	PreviewComponent?: ComponentType<PlaygroundPreviewProps>;
	reduceMotion?: boolean;
	colorResolver?: CssColorResolver;
	datasets?: Readonly<Record<DatasetId, readonly Brand[]>>;
}

export function Playground({
	PreviewComponent = PreviewPanel,
	reduceMotion,
	colorResolver = resolveCssColor,
	datasets = DEFAULT_DATASETS,
}: PlaygroundProps) {
	const [initialState] = useState(() =>
		createInitialState(
			reduceMotion ??
				window.matchMedia("(prefers-reduced-motion: reduce)").matches,
		),
	);
	const reducer = useMemo(
		() => createPlaygroundReducer(initialState, colorResolver),
		[initialState, colorResolver],
	);
	const [state, dispatch] = useReducer(reducer, initialState);
	const [retryKey, setRetryKey] = useState(0);
	const [controlsKey, setControlsKey] = useState(0);
	const [resetCount, setResetCount] = useState(0);
	const focusAfterRetryRef = useRef(false);
	useLayoutEffect(() => {
		if (!focusAfterRetryRef.current) return;
		focusAfterRetryRef.current = false;
		document.getElementById("preview-heading")?.focus();
	}, [retryKey]);
	const retryPreview = () => {
		focusAfterRetryRef.current = true;
		setRetryKey((key) => key + 1);
	};
	const resetPlayground = () => {
		dispatch({ type: "RESET_PLAYGROUND" });
		setControlsKey((key) => key + 1);
		setResetCount((count) => count + 1);
	};
	const resetAndRetry = () => {
		resetPlayground();
		retryPreview();
	};
	const dataset = selectDataset(state.shared.datasetId, datasets);
	const result = projectSlider(state, validateBrandDataset(dataset));
	const source =
		result.status === "ready"
			? generateSliderCode(result.invocation)
			: result.guidanceCode;

	return (
		<section className="playground" aria-labelledby="playground-heading">
			<h2 id="playground-heading" className="section-heading">
				Slider playground
			</h2>
			<div className="playground-workspace">
				<div className="playground-output">
					<PreviewComponent
						result={result}
						viewport={state.viewport}
						onViewportChange={(viewport) =>
							dispatch({ type: "SET_VIEWPORT", value: viewport })
						}
						retryKey={retryKey}
						onRetry={retryPreview}
						onResetAndRetry={resetAndRetry}
					/>
					<GeneratedCode source={source} />
				</div>
				<div className="playground-interaction">
					<ControlPanel
						key={controlsKey}
						state={state}
						dispatch={dispatch}
						colorResolver={colorResolver}
					/>
					<button
						className="reset-button"
						type="button"
						onClick={resetPlayground}
					>
						Reset playground
					</button>
					{resetCount > 0 ? (
						<p
							key={`reset-${resetCount}`}
							className="status-message"
							role="status"
							aria-live="polite"
						>
							Playground reset to initial settings.
						</p>
					) : null}
				</div>
			</div>
		</section>
	);
}
