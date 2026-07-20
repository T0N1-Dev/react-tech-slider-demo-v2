import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { PACKAGE_URL, REPOSITORY_URL } from "./showcase/constants";

const FADES_LIMITATION =
	"The fades variant cannot be paused through the current public API. This showcase does not claim full reduced-motion support.";

const previewFailure = vi.hoisted(() => ({ enabled: false }));
vi.mock("react-tech-slider", () => ({
	Slider: () => {
		if (previewFailure.enabled) throw new Error("simulated package failure");
		return <div data-testid="published-slider">Published slider</div>;
	},
}));

beforeEach(() => {
	previewFailure.enabled = false;
});

afterEach(() => {
	vi.restoreAllMocks();
	Object.defineProperty(navigator, "clipboard", {
		configurable: true,
		value: undefined,
	});
});

describe("App", () => {
	it("presents an ordered one-page evaluation and adoption flow", () => {
		render(<App />);

		expect(screen.getByRole("banner")).toBeVisible();
		expect(screen.getByRole("main")).toBeVisible();
		expect(screen.getByRole("contentinfo")).toBeVisible();
		expect(
			screen.getByRole("heading", {
				level: 1,
				name: "Evaluate react-tech-slider in one place",
			}),
		).toBeVisible();

		const target = document.getElementById("playground");
		expect(target).toHaveAttribute("tabindex", "-1");
		expect(
			screen.getByRole("link", { name: "Try the live playground" }),
		).toHaveAttribute("href", "#playground");

		const playgroundHeading = screen.getByRole("heading", {
			level: 2,
			name: "Slider playground",
		});
		const installHeading = screen.getByRole("heading", {
			level: 2,
			name: "Install",
		});
		const apiHeading = screen.getByRole("heading", {
			level: 2,
			name: "Adopt the public API",
		});
		expect(
			playgroundHeading.compareDocumentPosition(installHeading) &
				Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();
		expect(
			installHeading.compareDocumentPosition(apiHeading) &
				Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();
	});

	it("uses exact package resources and package-root integration guidance", () => {
		render(<App />);

		expect(screen.getByText("npm install react-tech-slider")).toBeVisible();
		const install = screen.getByRole("heading", { name: "Install" }).closest(
			"section",
		);
		expect(install).not.toBeNull();
		expect(
			within(install as HTMLElement).getByRole("link", { name: "npm package" }),
		).toHaveAttribute("href", PACKAGE_URL);
		expect(
			within(install as HTMLElement).getByRole("link", { name: "Repository" }),
		).toHaveAttribute("href", REPOSITORY_URL);
		const rootImport = screen.getByText(
			'import { Slider, type Brand } from "react-tech-slider";',
		);
		expect(rootImport).toBeVisible();
		expect(rootImport.closest("pre")).toHaveAttribute("tabindex", "0");
		expect(screen.getByText(/Use only package-root exports/)).toBeVisible();
		expect(
			screen.getByText("Do not import internal modules or CSS subpaths."),
		).toBeVisible();
		expect(
			screen.queryByText(/react-tech-slider\/dist/),
		).not.toBeInTheDocument();
	});

	it("repeats exact package resources in the hero and footer with full-size targets", () => {
		render(<App />);

		for (const landmark of [
			screen.getByRole("banner"),
			screen.getByRole("contentinfo"),
		]) {
			expect(
				within(landmark).getByRole("link", { name: "npm package" }),
			).toHaveAttribute("href", PACKAGE_URL);
			expect(
				within(landmark).getByRole("link", { name: "Repository" }),
			).toHaveAttribute("href", REPOSITORY_URL);
		}
		for (const resource of [
			...screen.getAllByRole("link", { name: "npm package" }),
			...screen.getAllByRole("link", { name: "Repository" }),
		]) {
			expect(resource).toHaveClass("resource-link");
		}
	});

	it("exposes stable responsive and non-color presentation hooks", async () => {
		const user = userEvent.setup();
		render(<App />);

		expect(document.querySelector(".site-shell")).toBeInTheDocument();
		expect(document.getElementById("playground")).toHaveClass(
			"playground-region",
		);
		expect(
			screen.getByRole("heading", { name: "Slider playground" }),
		).toHaveClass("section-heading");
		const canvas = screen.getByTestId("preview-canvas");
		expect(canvas).toHaveClass("preview-canvas");
		expect(canvas).toHaveAttribute("data-preview-width", "960");
		const desktop = screen.getByRole("button", { name: /desktop/i });
		expect(desktop).toHaveAttribute("aria-pressed", "true");
		expect(desktop).toHaveTextContent("Selected");
		await user.click(screen.getByRole("button", { name: /tablet/i }));
		expect(canvas).toHaveAttribute("data-preview-width", "768");
		await user.click(screen.getByRole("button", { name: /mobile/i }));
		expect(canvas).toHaveAttribute("data-preview-width", "390");
		expect(canvas).toHaveAttribute("data-fallback-count", "6");

		const generated = screen
			.getByRole("heading", { name: "Generated code" })
			.closest("section");
		expect(generated).toHaveClass("generated-code");
		expect(
			within(generated as HTMLElement).getByText(/import \{ Slider/),
		).toHaveClass("source-code");
		expect(
			screen.getByRole("heading", { name: "Controls" }).closest("section"),
		).toHaveClass("control-panel");
	});

	it("defines bounded responsive CSS without hiding layout or overriding animation", () => {
		const stylesPath = resolve(process.cwd(), "src/styles.css");
		expect(existsSync(stylesPath)).toBe(true);
		const css = existsSync(stylesPath) ? readFileSync(stylesPath, "utf8") : "";
		expect(css).toContain('[data-preview-width="960"]');
		expect(css).toContain('[data-preview-width="768"]');
		expect(css).toContain('[data-preview-width="390"]');
		expect(css).toContain("@media (max-width: 768px)");
		expect(css).toContain("@media (max-width: 390px)");
		expect(css).toContain(":focus-visible");
		expect(css).toMatch(/min-height:\s*44px/);
		expect(css).toMatch(/\.resource-link\s*\{[\s\S]*?min-height:\s*44px/);
		expect(css).toMatch(
			/@media \(prefers-reduced-motion: reduce\)[\s\S]*?scroll-behavior:\s*auto/,
		);
		expect(css).toMatch(/\.source-code\s*\{[\s\S]*?overflow:\s*auto/);
		expect(css).toMatch(/\.install-tabs\s*\{[\s\S]*?flex-wrap:\s*wrap/);
		expect(css).toMatch(/\.playground-output,[\s\S]*?min-width:\s*0/);
		expect(css).not.toMatch(/overflow-x\s*:\s*hidden/i);
		expect(css).not.toMatch(/animation(?:-play-state)?\s*:/i);
	});

	it("exposes non-color invalid, paused, and copy-success states", async () => {
		const user = userEvent.setup();
		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(navigator, "clipboard", {
			configurable: true,
			value: { writeText },
		});
		render(<App />);

		const playback = screen.getByRole("checkbox", { name: "Playback" });
		expect(screen.getByText("Playing")).toHaveAttribute(
			"data-state",
			"playing",
		);
		await user.click(playback);
		expect(screen.getByText("Paused")).toHaveAttribute("data-state", "paused");

		const duration = screen.getByLabelText("Duration (ms)");
		await user.clear(duration);
		await user.tab();
		expect(duration).toHaveAttribute("aria-invalid", "true");
		expect(duration.closest(".control-field")).toHaveAttribute(
			"data-state",
			"error",
		);

		await user.click(
			screen.getByRole("button", { name: "Copy generated code" }),
		);
		expect(
			screen
				.getByText("Generated code copied to clipboard.")
				.closest(".copy-block"),
		).toHaveAttribute("data-state", "success");
	});

	it("keeps adoption guidance available when the package preview fails", () => {
		previewFailure.enabled = true;
		vi.spyOn(console, "error").mockImplementation(() => undefined);
		render(<App />);

		const alert = screen.getByRole("alert");
		expect(alert).toHaveTextContent("Live preview unavailable");
		expect(alert).toHaveClass("preview-state");
		expect(alert).toHaveAttribute("data-state", "error");
		expect(screen.getByRole("heading", { name: "Install" })).toBeVisible();
		expect(
			screen.getByRole("heading", { name: "Adopt the public API" }),
		).toBeVisible();
		expect(screen.getByText("npm install react-tech-slider")).toBeVisible();
	});

	it("keeps source before controls and repeats the honest fades limitation", async () => {
		const user = userEvent.setup();
		render(<App />);

		const playground = document.getElementById("playground");
		expect(playground).not.toBeNull();
		const sourceHeading = within(playground as HTMLElement).getByRole(
			"heading",
			{
				name: "Generated code",
			},
		);
		const controlsHeading = within(playground as HTMLElement).getByRole(
			"heading",
			{
				name: "Controls",
			},
		);
		expect(
			sourceHeading.compareDocumentPosition(controlsHeading) &
				Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();

		await user.click(screen.getByRole("radio", { name: "Fades" }));
		expect(screen.getAllByText(FADES_LIMITATION)).toHaveLength(2);
		expect(
			screen.queryByText(/account|sign in|saved project/i),
		).not.toBeInTheDocument();
	});
});
