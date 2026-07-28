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
	Slider: ({ className }: { className?: string }) => {
		const isHeroSlider = className === "hero-slider";
		if (previewFailure.enabled && !isHeroSlider) {
			throw new Error("simulated package failure");
		}
		return (
			<div data-testid={isHeroSlider ? "hero-slider" : "published-slider"}>
				Published slider
			</div>
		);
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
		expect(
			playgroundHeading.compareDocumentPosition(installHeading) &
				Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();
	}, 10_000);

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
		expect(screen.getByTestId("generated-source")).toHaveTextContent(
			'import { Slider, type Brand } from "react-tech-slider";',
		);
		expect(screen.queryByText(/react-tech-slider\/dist/)).not.toBeInTheDocument();
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
		expect(canvas).toHaveAttribute("data-preview-variant", "desktop");
		const desktop = screen.getByRole("button", { name: /desktop/i });
		expect(desktop).toHaveAttribute("aria-pressed", "true");
		expect(desktop).toHaveTextContent("✓");
		await user.click(screen.getByRole("button", { name: /tablet/i }));
		expect(canvas).toHaveAttribute("data-preview-width", "768");
		expect(canvas).toHaveAttribute("data-preview-variant", "tablet");
		await user.click(screen.getByRole("button", { name: /mobile/i }));
		expect(canvas).toHaveAttribute("data-preview-width", "390");
		expect(canvas).toHaveAttribute("data-preview-variant", "mobile");
		expect(canvas).toHaveAttribute("data-fallback-count", "6");

		const generated = screen
			.getByRole("heading", { name: "Generated code" })
			.closest("section");
		expect(generated).toHaveClass("generated-code");
		const viewer = generated?.querySelector("pre.source-viewer");
		expect(viewer).toHaveAttribute("aria-labelledby", "generated-code-heading");
		expect(viewer).toContainElement(
			within(generated as HTMLElement).getByTestId("generated-source"),
		);
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
		expect(css).toMatch(
			/\[data-preview-variant="desktop"\]\s*\{[\s\S]*?--preview-display-width:\s*min\(100%, var\(--preview-target-width\)\)/,
		);
		expect(css).toMatch(
			/\[data-preview-variant="tablet"\]\s*\{[\s\S]*?--preview-display-width:\s*min\(86%, var\(--preview-target-width\)\)/,
		);
		expect(css).toMatch(
			/\[data-preview-variant="mobile"\]\s*\{[\s\S]*?--preview-display-width:\s*min\(100%, var\(--preview-target-width\)\)/,
		);
		expect(css).toContain("@media (max-width: 768px)");
		expect(css).toContain("@media (max-width: 390px)");
		expect(css).toContain(":focus-visible");
		expect(css).toMatch(/min-height:\s*44px/);
		expect(css).toMatch(/\.resource-link\s*\{[\s\S]*?min-height:\s*44px/);
		expect(css).toMatch(
			/@media \(prefers-reduced-motion: reduce\)[\s\S]*?scroll-behavior:\s*auto/,
		);
		const sourceViewer = css.match(/\.source-viewer\s*\{([\s\S]*?)\}/)?.[1] ?? "";
		expect(sourceViewer).toMatch(/max-width:\s*100%/);
		expect(sourceViewer).toMatch(/max-height:\s*28rem/);
		expect(sourceViewer).toMatch(/overflow:\s*auto/);
		expect(sourceViewer).toMatch(/white-space:\s*pre/);
		expect(sourceViewer).toMatch(/min-width:\s*0/);
		expect(css).toMatch(/\.source-line-number\s*\{[\s\S]*?user-select:\s*none/);
		const viewerSource = readFileSync(resolve(process.cwd(), "src/showcase/components/GeneratedCode.tsx"), "utf8");
		expect(viewerSource).not.toMatch(/dangerouslySetInnerHTML|innerHTML|contentEditable|<textarea/);
		expect(css).toMatch(/\.install-tabs\s*\{[\s\S]*?flex-wrap:\s*wrap/);
		const installField =
			css.match(/\.install-command-field\s*\{([\s\S]*?)\}/)?.[1] ?? "";
		expect(installField).toMatch(
			/grid-template-columns:\s*minmax\(0, 1fr\) auto/,
		);
		expect(installField).toMatch(/min-width:\s*0/);
		const installText =
			css.match(/\.install-command-text\s*\{([\s\S]*?)\}/)?.[1] ?? "";
		expect(installText).toMatch(/overflow-x:\s*auto/);
		expect(installText).toMatch(/user-select:\s*text/);
		expect(css).toMatch(/\.copy-button\s*\{[\s\S]*?min-width:\s*44px/);
		expect(css).toMatch(
			/@media \(max-width: 390px\)[\s\S]*?\.install-command-field/,
		);
		expect(css).toMatch(/\.playground-output,[\s\S]*?min-width:\s*0/);
		expect(css).not.toMatch(/overflow-x\s*:\s*hidden/i);
		expect(css).not.toMatch(
			/\.(?:rts-[A-Za-z0-9_-]*|wrapper|item|brand-slider)\b/,
		);
		expect(css).not.toMatch(/animation(?:-play-state)?\s*:/i);
	});

	it("exposes paused and copy-success states", async () => {
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

		expect(screen.getByLabelText("Duration (ms)")).toHaveAttribute("type", "range");

		await user.click(
			screen.getByRole("button", { name: "Copy generated code" }),
		);
		expect(
			screen
				.getByText("Generated code copied to clipboard.")
				.closest(".copy-block"),
		).toHaveAttribute("data-state", "success");
		const installSection = screen
			.getByRole("heading", { name: "Install" })
			.closest("section");
		expect(
			installSection?.querySelector(".copy-block--inline-field"),
		).toHaveAttribute("data-state", "idle");
		expect(
			screen.queryByText("Install command copied to clipboard."),
		).not.toBeInTheDocument();
	});

	it("keeps adoption guidance available when the package preview fails", () => {
		previewFailure.enabled = true;
		vi.spyOn(console, "error").mockImplementation(() => undefined);
		render(<App />);

		expect(screen.getByTestId("hero-slider")).toBeVisible();
		const alert = screen.getByRole("alert");
		expect(alert).toHaveTextContent("Live preview unavailable");
		expect(alert).toHaveClass("preview-state");
		expect(alert).toHaveAttribute("data-state", "error");
		expect(screen.getByRole("heading", { name: "Install" })).toBeVisible();
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
		expect(screen.getAllByText(FADES_LIMITATION)).toHaveLength(1);
		expect(
			screen.queryByText(/account|sign in|saved project/i),
		).not.toBeInTheDocument();
	});
});
