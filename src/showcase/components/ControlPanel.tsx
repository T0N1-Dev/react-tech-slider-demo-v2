import { useState, type Dispatch } from "react";
import { HexAlphaColorPicker } from "react-colorful";
import type { CssColorResolver } from "../color";
import {
  NUMERIC_DOMAINS,
  normalizeColor,
  type DatasetId,
  type NumericDomain,
  type PlaygroundAction,
  type PlaygroundState,
  type SliderVariant,
} from "../model";

interface ControlPanelProps {
  state: PlaygroundState;
  dispatch: Dispatch<PlaygroundAction>;
  colorResolver: CssColorResolver;
}

interface RangeFieldProps {
  id: string;
  label: string;
  unit: string;
  value: number;
  domain: NumericDomain;
  onChange: (raw: string) => void;
}

function RangeField({
  id,
  label,
  unit,
  value,
  domain,
  onChange,
}: RangeFieldProps) {
  return (
    <div className="control-field range-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="range"
        min={domain.min}
        max={domain.max}
        step={domain.step}
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
      />
      <output className={id} htmlFor={id}>
        {value} {unit}
      </output>
    </div>
  );
}

interface ColorFieldProps {
  id: string;
  label: string;
  value: string;
  colorResolver: CssColorResolver;
  onCommit: (value: string) => void;
}

function ColorField({
  id,
  label,
  value,
  colorResolver,
  onCommit,
}: ColorFieldProps) {
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState("");
  const errorId = `${id}-error`;
  const resolvedValue = colorResolver(value);
  if (!resolvedValue) throw new Error(`Unresolvable canonical color: ${value}`);

  const commit = () => {
    const result = normalizeColor(draft, value, colorResolver);
    if (result.status === "invalid") {
      setError("Enter a valid CSS color.");
      return;
    }
    setError("");
    setDraft(result.value);
    onCommit(result.value);
  };
  const setPickerColor = (candidate: string) => {
    const resolved = colorResolver(candidate);
    if (!resolved) return;
    setError("");
    setDraft(resolved.canonical);
    onCommit(resolved.canonical);
  };

  return (
    <div
      className="control-field color-field"
      data-state={error ? "error" : "idle"}
      role="group"
      aria-label={`${label} control`}
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
          if (event.key === "Enter") {
            event.preventDefault();
            commit();
          }
        }}
      />
      <HexAlphaColorPicker
        className="color-picker"
        aria-label={`${label} picker`}
        color={resolvedValue.pickerHex}
        onChange={setPickerColor}
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
  colorResolver,
}: ControlPanelProps) {
  const setVariant = (variant: SliderVariant) =>
    dispatch({ type: "SET_VARIANT", value: variant });
  const setDataset = (datasetId: DatasetId) =>
    dispatch({ type: "SET_DATASET", value: datasetId });

  return (
    <section className="control-panel" aria-labelledby="controls-heading">
      <h3 id="controls-heading" className="subsection-heading controls">
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
          <option value="core">Core</option>
          <option value="sport">Sport</option>
          <option value="food">Food</option>
        </select>
      </label>
      <RangeField
        id="icon-width"
        label="Icon width (rem)"
        unit="rem"
        value={state.shared.iconWidth}
        domain={NUMERIC_DOMAINS.iconWidth}
        onChange={(value) => dispatch({ type: "SET_ICON_WIDTH", value })}
      />
      {state.variant === "running" ? (
        <fieldset>
          <legend>Running settings</legend>
          <RangeField
            id="border-width"
            label="Border width (px)"
            unit="px"
            value={state.running.borderWidth}
            domain={NUMERIC_DOMAINS.borderWidth}
            onChange={(value) => dispatch({ type: "SET_BORDER_WIDTH", value })}
          />
          <ColorField
            id="border-color"
            label="Border color"
            value={state.running.borderColor}
            colorResolver={colorResolver}
            onCommit={(value) => dispatch({ type: "SET_BORDER_COLOR", value })}
          />
          <ColorField
            id="background-color"
            label="Background color"
            value={state.running.backgroundColor}
            colorResolver={colorResolver}
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
          <RangeField
            id="duration-ms"
            label="Duration (ms)"
            unit="ms"
            value={state.running.durationMs}
            domain={NUMERIC_DOMAINS.durationMs}
            onChange={(value) => dispatch({ type: "SET_DURATION_MS", value })}
          />
        </fieldset>
      ) : (
        <fieldset>
          <legend>Fades settings</legend>
          <RangeField
            id="fades-gap"
            label="Gap (px)"
            unit="px"
            value={state.fades.gap}
            domain={NUMERIC_DOMAINS.gap}
            onChange={(value) => dispatch({ type: "SET_FADES_GAP", value })}
          />
          <RangeField
            id="fades-speed"
            label="Speed (×)"
            unit="×"
            value={state.fades.speed}
            domain={NUMERIC_DOMAINS.speed}
            onChange={(value) => dispatch({ type: "SET_FADES_SPEED", value })}
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
