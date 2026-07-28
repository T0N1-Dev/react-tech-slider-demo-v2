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

function renderCopy(text = "manual source", targetLabel = "content") {
	return render(
		<CopyButton text={text} targetLabel={targetLabel}>
			<code tabIndex={0}>{text}</code>
		</CopyButton>,
	);
}

afterEach(() => {
	vi.useRealTimers();
	vi.restoreAllMocks();
	installClipboard(undefined);
});

describe("CopyButton", () => {
	it("keeps the generic copy control text-labeled", () => {
		renderCopy();

		const button = screen.getByRole("button", { name: "Copy content" });
		expect(button).toHaveTextContent("Copy content");
		expect(button.querySelector("svg")).not.toBeInTheDocument();
	});

	it("renders an icon-only copy control only for the terminal presentation", () => {
		render(
			<CopyButton
				text="npm install react-tech-slider"
				targetLabel="install command"
				presentation="terminal"
			>
				<code className="install-command-text">npm install react-tech-slider</code>
			</CopyButton>,
		);

		const field = document.querySelector(".install-command-field");
		const button = screen.getByRole("button", { name: "Copy install command" });
		expect(field).toContainElement(screen.getByText("npm install react-tech-slider"));
		expect(field).toContainElement(button);
		expect(button).toHaveAttribute("title", "Copy install command");
		expect(button).toHaveTextContent("");
		expect(button.querySelector("svg path")).toHaveAttribute(
			"d",
			"M288 64C252.7 64 224 92.7 224 128L224 384C224 419.3 252.7 448 288 448L480 448C515.3 448 544 419.3 544 384L544 183.4C544 166 536.9 149.3 524.3 137.2L466.6 81.8C454.7 70.4 438.8 64 422.3 64L288 64zM160 192C124.7 192 96 220.7 96 256L96 512C96 547.3 124.7 576 160 576L352 576C387.3 576 416 547.3 416 512L416 496L352 496L352 512L160 512L160 256L176 256L176 192L160 192z",
	);
	});

	it("copies exact text and announces success", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		installClipboard(writeText);
		renderCopy("npm install react-tech-slider", "install command");

		await userEvent.click(
			screen.getByRole("button", { name: "Copy install command" }),
		);
		expect(writeText).toHaveBeenCalledWith("npm install react-tech-slider");
		expect(
			screen.getByText("Install command copied to clipboard."),
		).toHaveAttribute("aria-live", "polite");
	});

	it.each([
		["rejected", vi.fn().mockRejectedValue(new Error("denied"))],
		["synchronous", vi.fn(() => { throw new Error("denied"); })],
		["absent", undefined],
	])("keeps visible source and manual-copy guidance when clipboard is %s", async (_case, writeText) => {
		installClipboard(writeText);
		renderCopy("source stays visible", "generated code");

		await userEvent.click(
			screen.getByRole("button", { name: "Copy generated code" }),
		);
		expect(screen.getByText("source stays visible")).toBeVisible();
		expect(
			screen.getByText(
				"Copy failed for generated code. Select and copy the text manually.",
			),
		).toHaveAttribute("aria-live", "polite");
		expect(
			screen.queryByText("Generated code copied to clipboard."),
		).not.toBeInTheDocument();
	});

	it("keeps feedback independent between instances", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		installClipboard(writeText);
		render(
			<>
				<div data-testid="first-copy">
					<CopyButton text="first" targetLabel="content"><code>first</code></CopyButton>
				</div>
				<div data-testid="second-copy">
					<CopyButton text="second" targetLabel="content"><code>second</code></CopyButton>
				</div>
			</>,
		);
		await userEvent.click(
			within(screen.getByTestId("first-copy")).getByRole("button"),
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
	});

	it.each(["{Enter}", " "])("uses native keyboard activation for %s", async (key) => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		installClipboard(writeText);
		renderCopy(`keyboard ${key}`);
		const button = screen.getByRole("button", { name: "Copy content" });
		button.focus();
		await userEvent.keyboard(key);
		expect(writeText).toHaveBeenCalledWith(`keyboard ${key}`);
	});

	it("ignores a stale completion from an earlier request", async () => {
		let resolveFirst: (() => void) | undefined;
		const writeText = vi
			.fn()
			.mockImplementationOnce(
				() => new Promise<void>((resolve) => { resolveFirst = resolve; }),
			)
			.mockRejectedValueOnce(new Error("latest denied"));
		installClipboard(writeText);
		renderCopy();
		const button = screen.getByRole("button", { name: "Copy content" });
		fireEvent.click(button);
		fireEvent.click(button);
		await act(async () => { await Promise.resolve(); });
		expect(screen.getByText(/Select and copy the text manually/)).toBeVisible();
		await act(async () => { resolveFirst?.(); await Promise.resolve(); });
		expect(screen.queryByText("Content copied to clipboard.")).not.toBeInTheDocument();
	});

	it("retains mounted behavior in StrictMode and clears timeout on unmount", async () => {
		vi.useFakeTimers();
		const writeText = vi.fn().mockResolvedValue(undefined);
		installClipboard(writeText);
		const { unmount } = render(
			<StrictMode>
				<CopyButton text="strict source" targetLabel="content">
					<code>strict source</code>
				</CopyButton>
			</StrictMode>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Copy content" }));
		await act(async () => { await Promise.resolve(); });
		expect(writeText).toHaveBeenCalledWith("strict source");
		expect(vi.getTimerCount()).toBe(1);
		unmount();
		expect(vi.getTimerCount()).toBe(0);
	});
});
