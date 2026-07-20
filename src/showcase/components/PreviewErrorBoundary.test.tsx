import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PreviewErrorBoundary } from "./PreviewErrorBoundary";

function ThrowingPreview(): never {
	throw new Error("package render failed");
}

let consoleError: ReturnType<typeof vi.spyOn> | undefined;

afterEach(() => consoleError?.mockRestore());

describe("PreviewErrorBoundary", () => {
	it("contains a throwing package subtree in a local alert", () => {
		consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
		render(
			<PreviewErrorBoundary onRetry={vi.fn()} onResetAndRetry={vi.fn()}>
				<ThrowingPreview />
			</PreviewErrorBoundary>,
		);
		expect(screen.getByRole("alert")).toHaveTextContent("Live preview unavailable");
		expect(screen.getByRole("button", { name: "Retry preview" })).toBeVisible();
		expect(
			screen.getByRole("button", { name: "Reset settings and retry" }),
		).toBeVisible();
	});
});
