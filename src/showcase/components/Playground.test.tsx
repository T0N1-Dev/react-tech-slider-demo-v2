import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { sliderSpy, sliderControl } = vi.hoisted(() => ({
	sliderSpy: vi.fn(),
	sliderControl: { shouldThrow: false },
}));

vi.mock("react-tech-slider", () => ({
	Slider: (props: Record<string, unknown>) => {
		sliderSpy(props);
		if (sliderControl.shouldThrow) throw new Error("package render failed");
		const brands = props.brandsList as
			| Array<{ id: number; name: string; img: string }>
			| undefined;
		return (
			<div data-testid="published-slider">
				{brands?.[0] ? (
					<img
						data-testid="package-image"
						src={brands[0].img}
						alt={brands[0].name}
					/>
				) : null}
			</div>
		);
	},
}));
import type { PlaygroundPreviewProps } from "./Playground";
import { Playground } from "./Playground";
import { InstallGuide } from "./InstallGuide";

const previewSpy = vi.fn();

function PreviewBoundary(props: PlaygroundPreviewProps) {
	previewSpy(props);
	return (
		<div data-testid="preview-boundary" data-viewport={props.viewport}>
			Preview boundary
			{(["desktop", "tablet", "mobile"] as const).map((viewport) => (
				<button
					key={viewport}
					type="button"
					aria-pressed={props.viewport === viewport}
					onClick={() => props.onViewportChange(viewport)}
				>
					{viewport}
				</button>
			))}
		</div>
	);
}

interface FakeImageInstance {
	onload: (() => void) | null;
	onerror: (() => void) | null;
	src: string;
	decode: ReturnType<typeof vi.fn<() => Promise<void>>>;
}

let preflightImages: FakeImageInstance[] = [];

const isValidColor = (candidate: string) =>
	["#7c05d8", "#00000033", "rebeccapurple", "transparent"].includes(candidate);

function renderPlayground(options?: {
	reduceMotion?: boolean;
	withInstall?: boolean;
}) {
	return render(
		<>
			<Playground
				PreviewComponent={PreviewBoundary}
				reduceMotion={options?.reduceMotion}
				isValidColor={isValidColor}
			/>
			{options?.withInstall ? <InstallGuide /> : null}
		</>,
	);
}

function generatedSource() {
	const heading = screen.getByRole("heading", { name: "Generated code" });
	const code = heading.parentElement?.querySelector("code");
	if (!code) throw new Error("Generated source not found");
	return code.textContent ?? "";
}

beforeEach(() => {
	previewSpy.mockClear();
	sliderSpy.mockClear();
	sliderControl.shouldThrow = false;
	preflightImages = [];
	class FakeImage implements FakeImageInstance {
		onload: (() => void) | null = null;
		onerror: (() => void) | null = null;
		src = "";
		decode = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);

		constructor() {
			preflightImages.push(this);
		}
	}
	vi.stubGlobal("Image", FakeImage);
});

afterEach(() => vi.unstubAllGlobals());

async function resolvePreflights() {
	await act(async () => {
		for (const image of preflightImages) image.onload?.();
		await Promise.resolve();
	});
}

describe("Playground", () => {
	it("passes exact canonical default running props to the published Slider", () => {
		render(<Playground reduceMotion={false} isValidColor={isValidColor} />);
		expect(screen.getByTestId("published-slider")).toBeVisible();
		expect(sliderSpy).toHaveBeenCalledOnce();
		const props = sliderSpy.mock.calls[0][0] as Record<string, unknown>;
		expect(Object.keys(props).sort()).toEqual([
			"backgroundColor",
			"borderColor",
			"borderWidth",
			"brandsList",
			"durationMs",
			"iconWidth",
			"isPlay",
			"pauseOnHoverActive",
		]);
		expect(props).toMatchObject({
			iconWidth: 5,
			borderWidth: 1,
			borderColor: "#7c05d8",
			backgroundColor: "#00000033",
			isPlay: true,
			pauseOnHoverActive: false,
			durationMs: 30000,
		});
		expect(props.brandsList).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: 1,
					name: "TypeScript",
					img: expect.stringMatching(/^data:/),
				}),
			]),
		);
	});

	it("renders default running controls and synchronized generated source", () => {
		renderPlayground();
		expect(
			screen.getByRole("region", { name: "Slider playground" }),
		).toBeVisible();
		expect(screen.getByRole("radio", { name: "Running" })).toBeChecked();
		expect(screen.getByLabelText("Icon width (rem)")).toHaveValue(5);
		expect(screen.getByLabelText("Border width (px)")).toHaveValue(1);
		expect(screen.getByLabelText("Duration (ms)")).toHaveValue(30000);
		expect(generatedSource()).toContain("import { Slider, type Brand }");
		expect(generatedSource()).toContain("iconWidth={5}");
		expect(
			screen.getByRole("button", { name: "Copy generated code" }),
		).toBeVisible();
		expect(previewSpy).toHaveBeenCalled();
	});

	it("exposes every running range/unit and no fades-only controls", () => {
		renderPlayground();
		expect(screen.getByLabelText("Icon width (rem)")).toHaveAttribute(
			"min",
			"1",
		);
		expect(screen.getByLabelText("Icon width (rem)")).toHaveAttribute(
			"max",
			"10",
		);
		expect(screen.getByLabelText("Icon width (rem)")).toHaveAttribute(
			"step",
			"0.25",
		);
		expect(screen.getByLabelText("Border width (px)")).toHaveAttribute(
			"min",
			"0",
		);
		expect(screen.getByLabelText("Border width (px)")).toHaveAttribute(
			"max",
			"8",
		);
		expect(screen.getByLabelText("Border color")).toHaveValue("#7c05d8");
		expect(screen.getByLabelText("Background color")).toHaveValue("#00000033");
		expect(screen.getByRole("checkbox", { name: "Playback" })).toBeChecked();
		expect(
			screen.getByRole("checkbox", { name: "Pause on hover" }),
		).not.toBeChecked();
		expect(screen.getByLabelText("Duration (ms)")).toHaveAttribute(
			"step",
			"1000",
		);
		expect(screen.queryByLabelText("Gap (px)")).not.toBeInTheDocument();
		expect(screen.queryByLabelText("Speed (×)")).not.toBeInTheDocument();
	});

	it("switches to exact fades controls/source and unmounts running controls", async () => {
		const user = userEvent.setup();
		renderPlayground();
		await user.click(screen.getByRole("radio", { name: "Fades" }));
		expect(screen.getByLabelText("Gap (px)")).toHaveAttribute("min", "0");
		expect(screen.getByLabelText("Gap (px)")).toHaveAttribute("max", "180");
		expect(screen.getByLabelText("Gap (px)")).toHaveAttribute("step", "4");
		expect(screen.getByLabelText("Speed (×)")).toHaveAttribute("min", "0.25");
		expect(screen.getByLabelText("Speed (×)")).toHaveAttribute("max", "4");
		expect(screen.getByLabelText("Speed (×)")).toHaveAttribute("step", "0.25");
		expect(
			screen.queryByLabelText("Border width (px)"),
		).not.toBeInTheDocument();
		expect(
			screen.queryByRole("checkbox", { name: "Playback" }),
		).not.toBeInTheDocument();
		expect(generatedSource()).toContain('variant="fades"');
		expect(generatedSource()).toContain("gap={48}");
		expect(generatedSource()).not.toContain("durationMs");
		expect(screen.getByRole("note")).toHaveTextContent(
			"The fades variant cannot be paused through the current public API. This showcase does not claim full reduced-motion support.",
		);
	});

	it("retains invalid drafts locally without changing generated source", () => {
		renderPlayground();
		const iconWidth = screen.getByLabelText("Icon width (rem)");
		fireEvent.change(iconWidth, { target: { value: "" } });
		fireEvent.blur(iconWidth);
		expect(iconWidth).toHaveValue(null);
		expect(iconWidth).toHaveAttribute("aria-invalid", "true");
		expect(
			screen.getByText(/Enter a finite value from 1 to 10 rem/),
		).toBeVisible();
		expect(generatedSource()).toContain("iconWidth={5}");

		const borderColor = screen.getByLabelText("Border color");
		fireEvent.change(borderColor, { target: { value: "not-a-color" } });
		fireEvent.blur(borderColor);
		expect(borderColor).toHaveValue("not-a-color");
		expect(borderColor).toHaveAttribute("aria-invalid", "true");
		expect(screen.getByText("Enter a valid CSS color.")).toBeVisible();
		expect(generatedSource()).not.toContain("not-a-color");
	});

	it("normalizes commits and preserves shared/running/fades edits across round trips", async () => {
		const user = userEvent.setup();
		renderPlayground();
		const icon = screen.getByLabelText("Icon width (rem)");
		await user.clear(icon);
		await user.type(icon, "7.12");
		fireEvent.blur(icon);
		expect(
			screen.getByText("Adjusted to 7 rem. Allowed range: 1 to 10 rem."),
		).toBeVisible();
		const duration = screen.getByLabelText("Duration (ms)");
		await user.clear(duration);
		await user.type(duration, "999999");
		fireEvent.blur(duration);
		expect(
			screen.getByText(
				"Adjusted to 120000 ms. Allowed range: 5000 to 120000 ms.",
			),
		).toBeVisible();
		await user.click(screen.getByRole("checkbox", { name: "Playback" }));
		await user.click(screen.getByRole("radio", { name: "Fades" }));
		const gap = screen.getByLabelText("Gap (px)");
		await user.clear(gap);
		await user.type(gap, "82");
		fireEvent.blur(gap);
		expect(
			screen.getByText("Adjusted to 84 px. Allowed range: 0 to 180 px."),
		).toBeVisible();
		expect(screen.getByLabelText("Icon width (rem)")).toHaveValue(7);
		expect(screen.getByLabelText("Gap (px)")).toHaveValue(84);
		await user.click(screen.getByRole("radio", { name: "Running" }));
		expect(screen.getByLabelText("Duration (ms)")).toHaveValue(120000);
		expect(
			screen.getByRole("checkbox", { name: "Playback" }),
		).not.toBeChecked();
		expect(generatedSource()).toContain("isPlay={false}");
		await user.click(screen.getByRole("radio", { name: "Fades" }));
		expect(screen.getByLabelText("Gap (px)")).toHaveValue(84);
	});

	it("keeps viewport preview-only and initializes running paused for reduced motion", async () => {
		const user = userEvent.setup();
		renderPlayground({ reduceMotion: true });
		const before = generatedSource();
		expect(before).toContain("isPlay={false}");
		await user.click(
			within(screen.getByTestId("preview-boundary")).getByRole("button", {
				name: "mobile",
			}),
		);
		expect(screen.getByTestId("preview-boundary")).toHaveAttribute(
			"data-viewport",
			"mobile",
		);
		expect(generatedSource()).toBe(before);
		expect(generatedSource()).not.toMatch(/viewport|mobile/);
	});

	it("clears invalid local drafts during atomic reset", async () => {
		const user = userEvent.setup();
		renderPlayground();
		const icon = screen.getByLabelText("Icon width (rem)");
		fireEvent.change(icon, { target: { value: "" } });
		fireEvent.blur(icon);
		expect(icon).toHaveAttribute("aria-invalid", "true");
		await user.click(screen.getByRole("button", { name: "Reset playground" }));
		expect(screen.getByLabelText("Icon width (rem)")).toHaveValue(5);
		expect(screen.getByLabelText("Icon width (rem)")).not.toHaveAttribute(
			"aria-invalid",
		);
		expect(
			screen.queryByText(/Enter a finite value from 1 to 10 rem/),
		).not.toBeInTheDocument();
	});

	it("atomically resets both stores, dataset, viewport, and focus", async () => {
		const user = userEvent.setup();
		renderPlayground();
		await user.selectOptions(
			screen.getByLabelText("Demonstration dataset"),
			"frontend",
		);
		const border = screen.getByLabelText("Border width (px)");
		await user.clear(border);
		await user.type(border, "4");
		fireEvent.blur(border);
		await user.click(screen.getByRole("radio", { name: "Fades" }));
		const gap = screen.getByLabelText("Gap (px)");
		await user.clear(gap);
		await user.type(gap, "80");
		fireEvent.blur(gap);
		await user.click(
			within(screen.getByTestId("preview-boundary")).getByRole("button", {
				name: "mobile",
			}),
		);
		const reset = screen.getByRole("button", { name: "Reset playground" });
		await user.click(reset);
		expect(reset).toHaveFocus();
		expect(
			screen.getByText("Playground reset to initial settings."),
		).toHaveAttribute("aria-live", "polite");
		expect(screen.getByRole("radio", { name: "Running" })).toBeChecked();
		expect(screen.getByLabelText("Demonstration dataset")).toHaveValue("core");
		expect(screen.getByLabelText("Border width (px)")).toHaveValue(1);
		expect(screen.getByTestId("preview-boundary")).toHaveAttribute(
			"data-viewport",
			"desktop",
		);
		await user.click(screen.getByRole("radio", { name: "Fades" }));
		expect(screen.getByLabelText("Gap (px)")).toHaveValue(48);
	});

	it("keeps selected variant focus and install selection independent from reset", async () => {
		const user = userEvent.setup();
		renderPlayground({ withInstall: true });
		await user.click(screen.getByRole("tab", { name: "pnpm" }));
		const fades = screen.getByRole("radio", { name: "Fades" });
		await user.click(fades);
		expect(fades).toHaveFocus();
		await user.click(screen.getByRole("button", { name: "Reset playground" }));
		expect(screen.getByRole("tab", { name: "pnpm" })).toHaveAttribute(
			"aria-selected",
			"true",
		);
		expect(screen.getByText("pnpm add react-tech-slider")).toBeVisible();
	});

	it("passes exact fades props and excludes running or preview-only keys", async () => {
		const user = userEvent.setup();
		render(<Playground reduceMotion={false} isValidColor={isValidColor} />);
		await user.click(screen.getByRole("radio", { name: "Fades" }));
		const props = sliderSpy.mock.calls.at(-1)?.[0] as Record<string, unknown>;
		expect(Object.keys(props).sort()).toEqual([
			"brandsList",
			"gap",
			"iconWidth",
			"speed",
			"variant",
		]);
		expect(props).toMatchObject({
			variant: "fades",
			iconWidth: 5,
			gap: 48,
			speed: 1,
		});
		for (const forbidden of [
			"borderWidth",
			"isPlay",
			"viewport",
			"reset",
			"copy",
			"install",
		]) {
			expect(props).not.toHaveProperty(forbidden);
		}
	});

	it("bypasses Slider for empty and invalid data with local guidance", () => {
		const { unmount } = render(
			<Playground
				reduceMotion={false}
				isValidColor={isValidColor}
				datasets={{ core: [], frontend: [] }}
			/>,
		);
		expect(sliderSpy).not.toHaveBeenCalled();
		const emptyState = within(screen.getByTestId("preview-canvas")).getByRole(
			"status",
		);
		expect(emptyState).toHaveTextContent(
			"brandsList requires at least one brand",
		);
		expect(emptyState).toHaveClass("preview-state");
		expect(emptyState).toHaveAttribute("data-state", "empty");
		expect(generatedSource()).toContain("brandsList");
		expect(generatedSource()).toContain('from "react-tech-slider"');
		expect(generatedSource()).toContain("<Slider");
		unmount();
		sliderSpy.mockClear();
		const duplicate = [
			{ id: 1, name: "One", img: "https://example.com/one.svg" },
			{ id: 1, name: "Two", img: "https://example.com/two.svg" },
		];
		render(
			<Playground
				reduceMotion={false}
				isValidColor={isValidColor}
				datasets={{ core: duplicate, frontend: duplicate }}
			/>,
		);
		expect(sliderSpy).not.toHaveBeenCalled();
		expect(screen.getByRole("alert")).toHaveClass("preview-state");
		expect(screen.getByRole("alert")).toHaveAttribute("data-state", "invalid");
		expect(screen.getByRole("alert")).toHaveTextContent(
			"finite unique IDs and meaningful non-empty names",
		);
		expect(screen.getByRole("alert")).toHaveTextContent(
			"Brand IDs must be unique.",
		);
		expect(generatedSource()).toContain("brandsList");
	});

	it("changes preset metadata without changing generated source", async () => {
		const user = userEvent.setup();
		render(<Playground reduceMotion={false} isValidColor={isValidColor} />);
		const before = generatedSource();
		expect(screen.getByRole("button", { name: /desktop/i })).toHaveAttribute(
			"aria-pressed",
			"true",
		);
		await user.click(screen.getByRole("button", { name: /^tablet/i }));
		expect(screen.getByTestId("preview-canvas")).toHaveAttribute(
			"data-preview-width",
			"768",
		);
		await user.click(screen.getByRole("button", { name: /^mobile/i }));
		expect(screen.getByTestId("preview-canvas")).toHaveAttribute(
			"data-preview-width",
			"390",
		);
		expect(generatedSource()).toBe(before);
	});

	it("reports only late matching canonical image failures", async () => {
		render(<Playground reduceMotion={false} isValidColor={isValidColor} />);
		await resolvePreflights();
		let props = sliderSpy.mock.calls.at(-1)?.[0] as Record<string, unknown>;
		const readyBrands = props.brandsList as Array<{ img: string }>;
		expect(readyBrands[0].img).toMatch(/^https:/);
		const canvas = screen.getByTestId("preview-canvas");
		const unrelated = document.createElement("img");
		unrelated.src = "https://example.com/unrelated.svg";
		canvas.append(unrelated);
		fireEvent.error(unrelated);
		props = sliderSpy.mock.calls.at(-1)?.[0] as Record<string, unknown>;
		expect((props.brandsList as Array<{ img: string }>)[0].img).toMatch(
			/^https:/,
		);
		fireEvent.error(screen.getByTestId("package-image"));
		props = sliderSpy.mock.calls.at(-1)?.[0] as Record<string, unknown>;
		expect((props.brandsList as Array<{ img: string }>)[0].img).toMatch(
			/^data:/,
		);
	});

	it("remains usable when every remote image is on fallback", () => {
		render(<Playground reduceMotion={false} isValidColor={isValidColor} />);
		act(() => {
			for (const image of preflightImages) image.onerror?.();
		});
		expect(screen.getByTestId("published-slider")).toBeVisible();
		const props = sliderSpy.mock.calls.at(-1)?.[0] as Record<string, unknown>;
		expect(
			(props.brandsList as Array<{ img: string }>).every(({ img }) =>
				img.startsWith("data:"),
			),
		).toBe(true);
		expect(
			screen.getByRole("heading", { name: "Generated code" }),
		).toBeVisible();
	});

	it("contains repeated package failure while controls, source, install, and disclosure survive", async () => {
		const consoleError = vi
			.spyOn(console, "error")
			.mockImplementation(() => undefined);
		sliderControl.shouldThrow = true;
		const user = userEvent.setup();
		render(
			<>
				<Playground reduceMotion={false} isValidColor={isValidColor} />
				<InstallGuide />
			</>,
		);
		expect(screen.getByRole("alert")).toHaveTextContent(
			"Live preview unavailable",
		);
		expect(screen.getByRole("heading", { name: "Controls" })).toBeVisible();
		expect(
			screen.getByRole("heading", { name: "Generated code" }),
		).toBeVisible();
		expect(
			screen.getByRole("tablist", { name: "Package manager" }),
		).toBeVisible();
		expect(screen.getByRole("link", { name: "npm package" })).toBeVisible();
		const failureCalls = sliderSpy.mock.calls.length;
		await user.click(screen.getByRole("radio", { name: "Fades" }));
		expect(screen.getByRole("note")).toHaveTextContent(
			"The fades variant cannot be paused through the current public API",
		);
		await user.click(screen.getByRole("button", { name: /^mobile/i }));
		expect(sliderSpy).toHaveBeenCalledTimes(failureCalls);
		await user.click(screen.getByRole("button", { name: "Retry preview" }));
		expect(screen.getByRole("alert")).toHaveTextContent(
			"Live preview unavailable",
		);
		consoleError.mockRestore();
	});

	it("retries with current normalized state and focuses the stable preview heading", async () => {
		const consoleError = vi
			.spyOn(console, "error")
			.mockImplementation(() => undefined);
		const user = userEvent.setup();
		render(<Playground reduceMotion={false} isValidColor={isValidColor} />);
		const border = screen.getByLabelText("Border width (px)");
		await user.clear(border);
		await user.type(border, "4");
		fireEvent.blur(border);
		sliderControl.shouldThrow = true;
		await user.click(screen.getByRole("checkbox", { name: "Playback" }));
		expect(screen.getByRole("alert")).toBeVisible();
		sliderControl.shouldThrow = false;
		await user.click(screen.getByRole("button", { name: "Retry preview" }));
		expect(screen.getByTestId("published-slider")).toBeVisible();
		const props = sliderSpy.mock.calls.at(-1)?.[0] as Record<string, unknown>;
		expect(props).toMatchObject({ borderWidth: 4, isPlay: false });
		expect(screen.getByRole("heading", { name: "Live preview" })).toHaveFocus();
		consoleError.mockRestore();
	});

	it("resets captured state and focuses preview during reset-and-retry", async () => {
		const consoleError = vi
			.spyOn(console, "error")
			.mockImplementation(() => undefined);
		const user = userEvent.setup();
		render(<Playground reduceMotion={false} isValidColor={isValidColor} />);
		await user.click(screen.getByRole("radio", { name: "Fades" }));
		sliderControl.shouldThrow = true;
		const gap = screen.getByLabelText("Gap (px)");
		await user.clear(gap);
		await user.type(gap, "80");
		fireEvent.blur(gap);
		expect(screen.getByRole("alert")).toBeVisible();
		sliderControl.shouldThrow = false;
		await user.click(
			screen.getByRole("button", { name: "Reset settings and retry" }),
		);
		expect(screen.getByRole("radio", { name: "Running" })).toBeChecked();
		expect(screen.getByLabelText("Border width (px)")).toHaveValue(1);
		expect(screen.getByRole("heading", { name: "Live preview" })).toHaveFocus();
		consoleError.mockRestore();
	});
});
