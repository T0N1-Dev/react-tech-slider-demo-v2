import { Component, type ReactNode } from "react";

interface PreviewErrorBoundaryProps {
	children: ReactNode;
	onRetry: () => void;
	onResetAndRetry: () => void;
}

interface PreviewErrorBoundaryState {
	failed: boolean;
}

export class PreviewErrorBoundary extends Component<
	PreviewErrorBoundaryProps,
	PreviewErrorBoundaryState
> {
	state: PreviewErrorBoundaryState = { failed: false };

	static getDerivedStateFromError(): PreviewErrorBoundaryState {
		return { failed: true };
	}

	render() {
		if (this.state.failed) {
			return (
				<div className="preview-state" data-state="error" role="alert">
					<p>Live preview unavailable</p>
					<button type="button" onClick={this.props.onRetry}>
						Retry preview
					</button>
					<button type="button" onClick={this.props.onResetAndRetry}>
						Reset settings and retry
					</button>
				</div>
			);
		}
		return this.props.children;
	}
}
