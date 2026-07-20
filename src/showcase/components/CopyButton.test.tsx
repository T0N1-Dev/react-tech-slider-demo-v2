import { StrictMode } from "react";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CopyButton } from "./CopyButton";

function installClipboard(writeText: unknown) {
	Object.defineProperty(navigator, "clipboard", {
		configurable: true,
		value: writeText === undefined ? undefined : { writeText },
	});
}

afterEach(() => {
	vi.useRealTimers();
	vi.restoreAllMocks();
	installClipboard(undefined);
});

describe("CopyButton", () => {
	it("copies the exact supplied text and announces success", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		const user = userEvent.setup();
		installClipboard(writeText);
		render(
			<CopyButton
				text="npm install react-tech-slider"
				targetLabel="install command"
			/>,
		);

		await user.click(
			screen.getByRole("button", { name: "Copy install command" }),
		);

		expect(writeText).toHaveBeenCalledOnce();
		expect(writeText).toHaveBeenCalledWith("npm install react-tech-slider");
		expect(
			screen.getByText("Install command copied to clipboard."),
		).toHaveAttribute("aria-live", "polite");
	});

	it("retains visible selectable source when clipboard rejects", async () => {
		const writeText = vi.fn().mockRejectedValue(new Error("denied"));
		const user = userEvent.setup();
		installClipboard(writeText);
		render(
			<CopyButton text="source stays visible" targetLabel="generated code" />,
		);

		await user.click(
			screen.getByRole("button", { name: "Copy generated code" }),
		);

		const source = screen.getByText("source stays visible");
		expect(source.tagName).toBe("CODE");
		expect(source).toBeVisible();
		expect(source).toHaveAttribute("tabindex", "0");
			expect(
				screen.getByText(
					"Copy failed for generated code. Select and copy the text manually.",
				),
			).toHaveAttribute("aria-live", "polite");
			expect(
				screen.queryByText("Generated code copied to clipboard."),
			).not.toBeInTheDocument();

	});

	it("handles an absent clipboard API without false success", async () => {
		const user = userEvent.setup();
		installClipboard(undefined);
			render(<CopyButton text="manual source" targetLabel="content" />);
			await user.click(screen.getByRole("button", { name: "Copy content" }));
			expect(
				screen.getByText(
					"Copy failed for content. Select and copy the text manually.",
				),
			).toBeVisible();
			expect(
				screen.queryByText("Content copied to clipboard."),
			).not.toBeInTheDocument();

	});

	it("handles synchronous clipboard failure", async () => {
		const writeText = vi.fn(() => {
			throw new Error("synchronous denial");
		});
		const user = userEvent.setup();
		installClipboard(writeText);
			render(<CopyButton text="manual source" targetLabel="content" />);
			await user.click(screen.getByRole("button", { name: "Copy content" }));
			expect(writeText).toHaveBeenCalledWith("manual source");
			expect(
				screen.getByText(
					"Copy failed for content. Select and copy the text manually.",
				),
			).toBeVisible();

	});

	it("keeps feedback independent between instances", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		const user = userEvent.setup();
		installClipboard(writeText);
		render(
			<>
				<div data-testid="first-copy">
					<CopyButton text="first" targetLabel="content" />
				</div>
				<div data-testid="second-copy">
					<CopyButton text="second" targetLabel="content" />
				</div>
			</>,
		);
		await user.click(
			within(screen.getByTestId("first-copy")).getByRole("button", {
				name: "Copy content",
			}),
		);
		expect(
			within(screen.getByTestId("first-copy")).getByText(
				"Content copied to clipboard.",
			),
		).toBeVisible();
		expect(
			within(screen.getByTestId("second-copy")).queryByText(
				"Content copied to clipboard.",
			),
		).not.toBeInTheDocument();
		expect(writeText).toHaveBeenCalledWith("first");
	});

	it.each([
		"{Enter}",
		" ",
	])("uses native keyboard activation for %s", async (key) => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		const user = userEvent.setup();
		installClipboard(writeText);
		render(<CopyButton text={`keyboard ${key}`} targetLabel="content" />);
		const button = screen.getByRole("button", { name: "Copy content" });
		button.focus();
		await user.keyboard(key);
		expect(writeText).toHaveBeenCalledWith(`keyboard ${key}`);
	});

	it("retains mounted-state behavior under React StrictMode", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		const user = userEvent.setup();
		installClipboard(writeText);
		render(
			<StrictMode>
				<CopyButton text="strict source" targetLabel="content" />
			</StrictMode>,
		);
		await user.click(screen.getByRole("button", { name: "Copy content" }));
		expect(writeText).toHaveBeenCalledWith("strict source");
		expect(screen.getByText("Content copied to clipboard.")).toBeVisible();
	});

	it("clears its success timeout when unmounted", async () => {
		vi.useFakeTimers();
		const writeText = vi.fn().mockResolvedValue(undefined);
		installClipboard(writeText);
		const { unmount } = render(
			<CopyButton text="timed source" targetLabel="content" />,
		);
		fireEvent.click(screen.getByRole("button", { name: "Copy content" }));
		await act(async () => {
			await Promise.resolve();
		});
		expect(vi.getTimerCount()).toBe(1);
		unmount();
		expect(vi.getTimerCount()).toBe(0);
	});
});
