import { Slider } from "react-tech-slider";
import type { SyntheticEvent } from "react";
import { PREVIEW_WIDTHS } from "../constants";
import {
	toPreviewProps,
	type InvocationResult,
	type ViewportPreset,
} from "../model";
import { useResolvedBrands } from "../useResolvedBrands";
import { PreviewErrorBoundary } from "./PreviewErrorBoundary";

export interface PreviewPanelProps {
	result: InvocationResult;
	viewport: ViewportPreset;
	onViewportChange: (viewport: ViewportPreset) => void;
	retryKey: number;
	onRetry: () => void;
	onResetAndRetry: () => void;
}

const VIEWPORTS = ["desktop", "tablet", "mobile"] as const;

export function PreviewPanel({
	result,
	viewport,
	onViewportChange,
	retryKey,
	onRetry,
	onResetAndRetry,
}: PreviewPanelProps) {
	const canonicalBrands =
		result.status === "ready" ? result.invocation.dataset : [];
	const { brands, reportLateFailure } = useResolvedBrands(canonicalBrands);
	const fallbackCount = brands.filter((brand) =>
		brand.img.startsWith("data:image/svg+xml"),
	).length;

	const captureImageFailure = (event: SyntheticEvent<HTMLDivElement>) => {
		const target = event.target;
		if (!(target instanceof HTMLImageElement)) return;
		const failedUrl = target.currentSrc || target.src;
		reportLateFailure(failedUrl);
	};

	return (
		<section className="preview-panel" aria-labelledby="preview-heading">
			<h3 id="preview-heading" className="subsection-heading" tabIndex={-1}>
				Live preview
			</h3>
			<fieldset className="preset-group">
				<legend>Preview size</legend>
				{VIEWPORTS.map((preset) => (
					<button
						key={preset}
						type="button"
						aria-pressed={viewport === preset}
						onClick={() => onViewportChange(preset)}
					>
						{preset}
						{viewport === preset ? " ✓ Selected" : ""}
					</button>
				))}
			</fieldset>
			<div
				className="preview-canvas"
				data-testid="preview-canvas"
				data-viewport={viewport}
				data-preview-width={PREVIEW_WIDTHS[viewport]}
				data-fallback-count={fallbackCount}
			>
				{result.status === "ready" ? (
					<PreviewErrorBoundary
						key={retryKey}
						onRetry={onRetry}
						onResetAndRetry={onResetAndRetry}
					>
						<div
							className="package-render"
							onErrorCapture={captureImageFailure}
						>
							<Slider {...toPreviewProps(result.invocation, brands)} />
						</div>
					</PreviewErrorBoundary>
				) : result.status === "empty" ? (
					<div className="preview-state" data-state="empty" role="status">
						<p>Preview unavailable: brandsList requires at least one brand.</p>
						<code>{result.guidanceCode}</code>
					</div>
				) : (
					<div className="preview-state" data-state="invalid" role="alert">
						<p>
							Invalid brand data. Use finite unique IDs and meaningful non-empty
							names. {result.reason}
						</p>
						<code>{result.guidanceCode}</code>
					</div>
				)}
			</div>
		</section>
	);
}
