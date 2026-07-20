import { useState, type Dispatch } from "react";
import {
	NUMERIC_DOMAINS,
	normalizeColor,
	normalizeNumber,
	type DatasetId,
	type NumericDomain,
	type PlaygroundAction,
	type PlaygroundState,
	type SliderVariant,
} from "../model";

interface ControlPanelProps {
	state: PlaygroundState;
	dispatch: Dispatch<PlaygroundAction>;
	isValidColor: (candidate: string) => boolean;
}

interface NumericFieldProps {
	id: string;
	label: string;
	unit: string;
	value: number;
	domain: NumericDomain;
	onCommit: (value: number) => void;
}

function NumericField({
	id,
	label,
	unit,
	value,
	domain,
	onCommit,
}: NumericFieldProps) {
	const [edit, setEdit] = useState({ baseValue: value, text: String(value) });
	const draft = edit.baseValue === value ? edit.text : String(value);
	const [feedback, setFeedback] = useState<
		{ kind: "error" | "correction"; message: string } | undefined
	>();
	const feedbackId = `${id}-feedback`;

	const commit = () => {
		const result = normalizeNumber(draft, domain, value);
		if (result.status === "invalid") {
			setFeedback({
				kind: "error",
				message: `Enter a finite value from ${domain.min} to ${domain.max} ${unit}.`,
			});
			return;
		}
		setFeedback(
			result.status === "corrected"
				? {
						kind: "correction",
						message: `Adjusted to ${result.value} ${unit}. Allowed range: ${domain.min} to ${domain.max} ${unit}.`,
					}
				: undefined,
		);
		setEdit({ baseValue: result.value, text: String(result.value) });
		onCommit(result.value);
	};

	return (
		<div className="control-field" data-state={feedback?.kind ?? "idle"}>
			<label htmlFor={id}>{label}</label>
			<input
				id={id}
				type="number"
				min={domain.min}
				max={domain.max}
				step={domain.step}
				value={draft}
				aria-invalid={feedback?.kind === "error" ? "true" : undefined}
				aria-describedby={feedback ? feedbackId : undefined}
				onChange={(event) => {
					setEdit({ baseValue: value, text: event.target.value });
					setFeedback(undefined);
				}}
				onBlur={commit}
				onKeyDown={(event) => {
					if (event.key === "Enter") event.currentTarget.blur();
				}}
			/>
			<output htmlFor={id}>
				{value} {unit}
			</output>
			{feedback ? (
				<span className="field-feedback" id={feedbackId}>
					{feedback.message}
				</span>
			) : null}
		</div>
	);
}

interface ColorFieldProps {
	id: string;
	label: string;
	value: string;
	isValidColor: (candidate: string) => boolean;
	onCommit: (value: string) => void;
}

function ColorField({
	id,
	label,
	value,
	isValidColor,
	onCommit,
}: ColorFieldProps) {
	const [draft, setDraft] = useState(value);
	const [error, setError] = useState("");
	const errorId = `${id}-error`;

	const commit = () => {
		const result = normalizeColor(draft, value, isValidColor);
		if (result.status === "invalid") {
			setError("Enter a valid CSS color.");
			return;
		}
		setError("");
		setDraft(result.value);
		onCommit(result.value);
	};

	return (
		<div
			className="control-field color-field"
			data-state={error ? "error" : "idle"}
		>
			<label htmlFor={id}>{label}</label>
			<input
				id={id}
				type="text"
				value={draft}
				aria-invalid={error ? "true" : undefined}
				aria-describedby={error ? errorId : undefined}
				onChange={(event) => {
					setDraft(event.target.value);
					setError("");
				}}
				onBlur={commit}
				onKeyDown={(event) => {
					if (event.key === "Enter") event.currentTarget.blur();
				}}
			/>
			<span
				className="color-swatch"
				aria-hidden="true"
				title={`${label} swatch`}
				style={{ backgroundColor: value }}
			/>
			{error ? (
				<span className="field-feedback" id={errorId}>
					{error}
				</span>
			) : null}
		</div>
	);
}

export function ControlPanel({
	state,
	dispatch,
	isValidColor,
}: ControlPanelProps) {
	const setVariant = (variant: SliderVariant) =>
		dispatch({ type: "SET_VARIANT", value: variant });
	const setDataset = (datasetId: DatasetId) =>
		dispatch({ type: "SET_DATASET", value: datasetId });

	return (
		<section className="control-panel" aria-labelledby="controls-heading">
			<h3 id="controls-heading" className="subsection-heading">
				Controls
			</h3>
			<fieldset className="variant-picker">
				<legend>Variant</legend>
				<label>
					<input
						type="radio"
						name="slider-variant"
						checked={state.variant === "running"}
						onChange={() => setVariant("running")}
					/>
					Running
				</label>
				<label>
					<input
						type="radio"
						name="slider-variant"
						checked={state.variant === "fades"}
						onChange={() => setVariant("fades")}
					/>
					Fades
				</label>
			</fieldset>
			<label className="dataset-picker">
				Demonstration dataset
				<select
					value={state.shared.datasetId}
					onChange={(event) => setDataset(event.target.value as DatasetId)}
				>
					<option value="core">Core technologies</option>
					<option value="frontend">Frontend frameworks</option>
				</select>
			</label>
			<NumericField
				id="icon-width"
				label="Icon width (rem)"
				unit="rem"
				value={state.shared.iconWidth}
				domain={NUMERIC_DOMAINS.iconWidth}
				onCommit={(value) => dispatch({ type: "SET_ICON_WIDTH", value })}
			/>
			{state.variant === "running" ? (
				<fieldset>
					<legend>Running settings</legend>
					<NumericField
						id="border-width"
						label="Border width (px)"
						unit="px"
						value={state.running.borderWidth}
						domain={NUMERIC_DOMAINS.borderWidth}
						onCommit={(value) => dispatch({ type: "SET_BORDER_WIDTH", value })}
					/>
					<ColorField
						key={`border-color-${state.running.borderColor}`}
						id="border-color"
						label="Border color"
						value={state.running.borderColor}
						isValidColor={isValidColor}
						onCommit={(value) => dispatch({ type: "SET_BORDER_COLOR", value })}
					/>
					<ColorField
						key={`background-${state.running.backgroundColor}`}
						id="background-color"
						label="Background color"
						value={state.running.backgroundColor}
						isValidColor={isValidColor}
						onCommit={(value) =>
							dispatch({ type: "SET_BACKGROUND_COLOR", value })
						}
					/>
					<label>
						<input
							type="checkbox"
							checked={state.running.isPlay}
							onChange={(event) =>
								dispatch({
									type: "SET_RUNNING_PLAYBACK",
									value: event.target.checked,
								})
							}
						/>
						Playback
					</label>
					<span
						className="playback-status"
						data-state={state.running.isPlay ? "playing" : "paused"}
					>
						{state.running.isPlay ? "Playing" : "Paused"}
					</span>
					<label>
						<input
							type="checkbox"
							checked={state.running.pauseOnHoverActive}
							onChange={(event) =>
								dispatch({
									type: "SET_RUNNING_PAUSE_ON_HOVER",
									value: event.target.checked,
								})
							}
						/>
						Pause on hover
					</label>
					<NumericField
						id="duration-ms"
						label="Duration (ms)"
						unit="ms"
						value={state.running.durationMs}
						domain={NUMERIC_DOMAINS.durationMs}
						onCommit={(value) => dispatch({ type: "SET_DURATION_MS", value })}
					/>
				</fieldset>
			) : (
				<fieldset>
					<legend>Fades settings</legend>
					<NumericField
						id="fades-gap"
						label="Gap (px)"
						unit="px"
						value={state.fades.gap}
						domain={NUMERIC_DOMAINS.gap}
						onCommit={(value) => dispatch({ type: "SET_FADES_GAP", value })}
					/>
					<NumericField
						id="fades-speed"
						label="Speed (×)"
						unit="×"
						value={state.fades.speed}
						domain={NUMERIC_DOMAINS.speed}
						onCommit={(value) => dispatch({ type: "SET_FADES_SPEED", value })}
					/>
					<p className="limitation-note" role="note">
						The fades variant cannot be paused through the current public API.
						This showcase does not claim full reduced-motion support.
					</p>
				</fieldset>
			)}
		</section>
	);
}
