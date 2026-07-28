import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resolveCssColor, type CssColorResolver } from "../color";
import { InstallGuide } from "./InstallGuide";
import type { PlaygroundPreviewProps } from "./Playground";
import { Playground } from "./Playground";

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

vi.mock("react-colorful", () => ({
  HexAlphaColorPicker: ({
    color,
    onChange,
    ...props
  }: {
    color: string;
    onChange: (color: string) => void;
    "aria-label": string;
  }) => (
    <input
      aria-label={props["aria-label"]}
      data-picker-color={color}
      value={color}
      onChange={(event) => onChange(event.currentTarget.value)}
    />
  ),
}));

const previewSpy = vi.fn();

function PreviewBoundary(props: PlaygroundPreviewProps) {
  previewSpy(props);
  return (
    <div data-testid="preview-boundary" data-viewport={props.viewport}>
      Preview boundary
      {(["desktop", "mobile"] as const).map((viewport) => (
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

const COLOR_PROJECTIONS: Record<string, string> = {
  rebeccapurple: "#663399ff",
  transparent: "#00000000",
  "rgb(10 20 30 / 20%)": "#0a141e33",
  "hsl(120 100% 25%)": "#008000ff",
};
const colorResolver: CssColorResolver = (candidate) => {
  const canonical = candidate.trim();
  const pickerHex = COLOR_PROJECTIONS[canonical];
  return pickerHex ? { canonical, pickerHex } : resolveCssColor(canonical);
};

function renderPlayground(options?: {
  reduceMotion?: boolean;
  withInstall?: boolean;
}) {
  return render(
    <>
      <Playground
        PreviewComponent={PreviewBoundary}
        reduceMotion={options?.reduceMotion}
        colorResolver={colorResolver}
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

function latestBrands() {
  const props = sliderSpy.mock.calls.at(-1)?.[0] as Record<string, unknown>;
  return props.brandsList as Array<Record<string, unknown>>;
}

function expectGlobalIconWidthInheritance(
  brands: Array<Record<string, unknown>>,
  iconWidth = 5,
) {
  expect(brands.every((brand) => !("width" in brand) && !("height" in brand))).toBe(true);
  expect(brands.every((brand) => !("width" in ((brand.style ?? {}) as object)))).toBe(true);
  expect(sliderSpy.mock.calls.at(-1)?.[0]).toMatchObject({ iconWidth });
}

function outputFor(input: HTMLElement) {
  const output = document.querySelector(`output[for="${input.id}"]`);
  if (!output) throw new Error(`Output not found for ${input.id}`);
  return output;
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
    render(<Playground reduceMotion={false} colorResolver={colorResolver} />);
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

  it("offers only Core, Sport, and Food and switches canonical preview/source together", async () => {
        const user = userEvent.setup();
        render(<Playground reduceMotion={false} colorResolver={colorResolver} />);
        const selector = screen.getByLabelText("Demonstration dataset");
        expect(screen.getAllByRole("option").map((option) => [option.textContent, option.getAttribute("value")])).toEqual([
          ["Core", "core"],
          ["Sport", "sport"],
          ["Food", "food"],
        ]);
        expect(screen.queryByRole("option", { name: /frontend/i })).not.toBeInTheDocument();
        expectGlobalIconWidthInheritance(latestBrands());

        await user.selectOptions(selector, "sport");
        expect(generatedSource()).toContain("Puma");
        expect(generatedSource()).toContain("v1744835609/puma-logo-logo-svgrepo-com_ylvldf.svg");
        expect(generatedSource()).not.toMatch(/New Balance|Converse|Asics/);
        expect(latestBrands()).toHaveLength(7);
        expect(latestBrands().map(({ id }) => id)).toEqual([1, 2, 3, 4, 5, 6, 7]);
        expect(latestBrands()[1]).toMatchObject({ className: "reebok-icon", style: { transition: "width 1s ease", filter: "invert()" } });
        expectGlobalIconWidthInheritance(latestBrands());

        await user.selectOptions(selector, "food");
        expect(generatedSource()).toContain("Papa Johns");
        expect(generatedSource()).toContain("Dunkin`Donuts");
        expect(generatedSource()).not.toContain("Puma");
        expect(latestBrands()).toHaveLength(10);
        expect(latestBrands().map(({ id }) => id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        expect(latestBrands().every((brand) => !("className" in brand))).toBe(true);
        expectGlobalIconWidthInheritance(latestBrands());
      });

      it("applies live global iconWidth to Core, Sport, and Food without masking metadata", async () => {
        const user = userEvent.setup();
        render(<Playground reduceMotion={false} colorResolver={colorResolver} />);
        const selector = screen.getByLabelText("Demonstration dataset");
        for (const [dataset, width] of [["core", 6], ["sport", 7], ["food", 8]] as const) {
          await user.selectOptions(selector, dataset);
          fireEvent.change(screen.getByLabelText("Icon width (rem)"), {
            target: { value: String(width) },
          });
          expectGlobalIconWidthInheritance(latestBrands(), width);
          expect(generatedSource()).toContain(`iconWidth={${width}}`);
        }
      });

      it("renders default running controls and synchronized generated source", () => {
    renderPlayground();
    expect(
      screen.getByRole("region", { name: "Slider playground" }),
    ).toBeVisible();
    expect(screen.getByRole("radio", { name: "Running" })).toBeChecked();
expect(screen.getByLabelText("Icon width (rem)")).toHaveValue("5");
    expect(screen.getByLabelText("Border width (px)")).toHaveValue("1");
    expect(screen.getByLabelText("Duration (ms)")).toHaveValue("30000");
    expect(generatedSource()).toContain("import { Slider, type Brand }");
    expect(generatedSource()).toContain("iconWidth={5}");
    expect(
      screen.getByRole("button", { name: "Copy generated code" }),
    ).toBeVisible();
    expect(previewSpy).toHaveBeenCalled();
  });

it("exposes exact native running ranges and no fades-only controls", () => {
    renderPlayground();
    const cases = [
      ["Icon width (rem)", "1", "10", "0.25", "5 rem"],
      ["Border width (px)", "0", "8", "1", "1 px"],
      ["Duration (ms)", "5000", "120000", "1000", "30000 ms"],
    ] as const;
    for (const [label, min, max, step, output] of cases) {
      const input = screen.getByLabelText(label);
      expect(input).toHaveAttribute("type", "range");
      expect(input).toHaveAttribute("min", min);
      expect(input).toHaveAttribute("max", max);
      expect(input).toHaveAttribute("step", step);
      expect(input).not.toHaveAttribute("onkeydown");
      expect(outputFor(input)).toHaveTextContent(output);
    }
    expect(screen.getByLabelText("Border color")).toHaveValue("#7c05d8");
    expect(screen.getByLabelText("Background color")).toHaveValue("#00000033");
    expect(screen.queryByLabelText("Gap (px)")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Speed (×)")).not.toBeInTheDocument();
  });

  it("switches to exact fades controls/source and unmounts running controls", async () => {
    const user = userEvent.setup();
    renderPlayground();
    await user.click(screen.getByRole("radio", { name: "Fades" }));
    expect(screen.getByLabelText("Gap (px)")).toHaveAttribute("type", "range");
    expect(screen.getByLabelText("Speed (×)")).toHaveAttribute("type", "range");
    expect(screen.getByLabelText("Gap (px)")).toHaveAttribute("min", "0");
    expect(screen.getByLabelText("Gap (px)")).toHaveAttribute("max", "180");
    expect(screen.getByLabelText("Gap (px)")).toHaveAttribute("step", "4");
    expect(screen.getByLabelText("Speed (×)")).toHaveAttribute("min", "0.25");
    expect(screen.getByLabelText("Speed (×)")).toHaveAttribute("max", "4");
    expect(screen.getByLabelText("Speed (×)")).toHaveAttribute("step", "0.25");
        expect(outputFor(screen.getByLabelText("Gap (px)"))).toHaveTextContent("96 px");
        expect(outputFor(screen.getByLabelText("Speed (×)"))).toHaveTextContent("1 ×");
    expect(
      screen.queryByLabelText("Border width (px)"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("checkbox", { name: "Playback" }),
    ).not.toBeInTheDocument();
    expect(generatedSource()).toContain('variant="fades"');
    expect(generatedSource()).toContain("gap={96}");
    expect(generatedSource()).not.toContain("durationMs");
    expect(screen.getByRole("note")).toHaveTextContent(
      "The fades variant cannot be paused through the current public API. This showcase does not claim full reduced-motion support.",
    );
  });

it("renders exactly two projected alpha pickers and removes the swatch path", () => {
renderPlayground();
const borderPicker = screen.getByLabelText("Border color picker");
const backgroundPicker = screen.getByLabelText("Background color picker");
expect(borderPicker).toHaveAttribute("data-picker-color", "#7c05d8ff");
expect(backgroundPicker).toHaveAttribute("data-picker-color", "#00000033");
expect(screen.getAllByLabelText(/color picker$/)).toHaveLength(2);
expect(document.querySelector(".color-swatch")).not.toBeInTheDocument();
});

it("commits picker and precise text colors through one canonical boundary", async () => {
const user = userEvent.setup();
render(<Playground reduceMotion={false} colorResolver={colorResolver} />);
const borderPicker = screen.getByLabelText("Border color picker");
fireEvent.change(borderPicker, { target: { value: "#12345678" } });
expect(screen.getByLabelText("Border color")).toHaveValue("#12345678");
expect(borderPicker).toHaveAttribute("data-picker-color", "#12345678");
expect(sliderSpy.mock.calls.at(-1)?.[0]).toHaveProperty("borderColor", "#12345678");
expect(generatedSource()).toContain('borderColor="#12345678"');

const borderText = screen.getByLabelText("Border color");
borderText.focus();
fireEvent.change(borderText, { target: { value: " rebeccapurple " } });
fireEvent.keyDown(borderText, { key: "Enter" });
expect(borderText).toHaveFocus();
expect(borderText).toHaveValue("rebeccapurple");
expect(borderPicker).toHaveAttribute("data-picker-color", "#663399ff");
expect(sliderSpy.mock.calls.at(-1)?.[0]).toHaveProperty("borderColor", "rebeccapurple");
expect(generatedSource()).toContain('borderColor="rebeccapurple"');

const backgroundText = screen.getByLabelText("Background color");
fireEvent.change(backgroundText, { target: { value: "hsl(120 100% 25%)" } });
fireEvent.blur(backgroundText);
const backgroundPicker = screen.getByLabelText("Background color picker");
expect(backgroundPicker).toHaveAttribute("data-picker-color", "#008000ff");
fireEvent.change(backgroundPicker, { target: { value: "#abcdef00" } });
expect(backgroundText).toHaveValue("#abcdef00");
expect(sliderSpy.mock.calls.at(-1)?.[0]).toMatchObject({
borderColor: "rebeccapurple",
backgroundColor: "#abcdef00",
});

fireEvent.change(borderText, { target: { value: "transparent" } });
fireEvent.blur(borderText);
fireEvent.change(backgroundText, {
target: { value: "rgb(10 20 30 / 20%)" },
});
fireEvent.blur(backgroundText);
expect(borderPicker).toHaveAttribute("data-picker-color", "#00000000");
expect(backgroundPicker).toHaveAttribute("data-picker-color", "#0a141e33");
expect(sliderSpy.mock.calls.at(-1)?.[0]).toMatchObject({
borderColor: "transparent",
backgroundColor: "rgb(10 20 30 / 20%)",
});

await user.click(screen.getByRole("radio", { name: "Fades" }));
await user.click(screen.getByRole("radio", { name: "Running" }));
expect(screen.getByLabelText("Border color")).toHaveValue("transparent");
expect(screen.getByLabelText("Background color")).toHaveValue(
"rgb(10 20 30 / 20%)",
);
});

it("retains invalid color drafts without changing canonical picker, preview, or source", async () => {
const user = userEvent.setup();
render(<Playground reduceMotion={false} colorResolver={colorResolver} />);
const borderColor = screen.getByLabelText("Border color");
const borderPicker = screen.getByLabelText("Border color picker");
fireEvent.change(borderColor, { target: { value: "not-a-color" } });
borderColor.focus();
fireEvent.keyDown(borderColor, { key: "Enter" });
expect(borderColor).toHaveValue("not-a-color");
expect(borderColor).toHaveFocus();
expect(borderColor).toHaveAttribute("aria-invalid", "true");
expect(screen.getByText("Enter a valid CSS color.")).toBeVisible();
expect(borderPicker).toHaveAttribute("data-picker-color", "#7c05d8ff");
expect(sliderSpy.mock.calls.at(-1)?.[0]).toHaveProperty("borderColor", "#7c05d8");
expect(generatedSource()).not.toContain("not-a-color");

await user.click(screen.getByRole("radio", { name: "Fades" }));
expect(screen.queryByLabelText("Border color picker")).not.toBeInTheDocument();
await user.click(screen.getByRole("radio", { name: "Running" }));
expect(screen.getByLabelText("Border color")).toHaveValue("#7c05d8");
fireEvent.change(screen.getByLabelText("Border color"), {
target: { value: "still-invalid" },
});
await user.click(screen.getByRole("button", { name: "Reset playground" }));
expect(screen.getByLabelText("Border color")).toHaveValue("#7c05d8");
});

it("updates all five ranges in output, preview props, and source before blur", async () => {
const user = userEvent.setup();
render(<Playground reduceMotion={false} colorResolver={colorResolver} />);
    const change = (label: string, value: number, unit: string, prop: string) => {
      const input = screen.getByLabelText(label);
      fireEvent.change(input, { target: { value: String(value) } });
      expect(input).toHaveValue(String(value));
      expect(outputFor(input)).toHaveTextContent(`${value} ${unit}`);
      expect(sliderSpy.mock.calls.at(-1)?.[0]).toHaveProperty(prop, value);
      expect(generatedSource()).toContain(`${prop}={${value}}`);
    };

    change("Icon width (rem)", 6.25, "rem", "iconWidth");
    change("Border width (px)", 4, "px", "borderWidth");
    change("Duration (ms)", 45000, "ms", "durationMs");
    await user.click(screen.getByRole("radio", { name: "Fades" }));
    change("Gap (px)", 84, "px", "gap");
    change("Speed (×)", 1.5, "×", "speed");
    expect(sliderSpy.mock.calls.at(-1)?.[0]).not.toHaveProperty("borderWidth");
    expect(generatedSource()).not.toContain("durationMs");

    await user.click(screen.getByRole("radio", { name: "Running" }));
    expect(screen.getByLabelText("Icon width (rem)")).toHaveValue("6.25");
    expect(screen.getByLabelText("Border width (px)")).toHaveValue("4");
    expect(screen.getByLabelText("Duration (ms)")).toHaveValue("45000");
    await user.click(screen.getByRole("radio", { name: "Fades" }));
    expect(screen.getByLabelText("Gap (px)")).toHaveValue("84");
    expect(screen.getByLabelText("Speed (×)")).toHaveValue("1.5");
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

it("resets all shared and variant-specific ranges atomically", async () => {
    const user = userEvent.setup();
    renderPlayground();
    fireEvent.change(screen.getByLabelText("Icon width (rem)"), { target: { value: "7" } });
    fireEvent.change(screen.getByLabelText("Border width (px)"), { target: { value: "4" } });
    fireEvent.change(screen.getByLabelText("Duration (ms)"), { target: { value: "45000" } });
    await user.click(screen.getByRole("radio", { name: "Fades" }));
    fireEvent.change(screen.getByLabelText("Gap (px)"), { target: { value: "80" } });
    fireEvent.change(screen.getByLabelText("Speed (×)"), { target: { value: "2" } });
    await user.click(screen.getByRole("button", { name: "Reset playground" }));
    expect(screen.getByRole("radio", { name: "Running" })).toBeChecked();
    expect(screen.getByLabelText("Icon width (rem)")).toHaveValue("5");
    expect(screen.getByLabelText("Border width (px)")).toHaveValue("1");
    expect(screen.getByLabelText("Duration (ms)")).toHaveValue("30000");
    await user.click(screen.getByRole("radio", { name: "Fades" }));
    expect(screen.getByLabelText("Gap (px)")).toHaveValue("96");
    expect(screen.getByLabelText("Speed (×)")).toHaveValue("1");
  });

  it("atomically resets both stores, dataset, viewport, and focus", async () => {
    const user = userEvent.setup();
    renderPlayground();
await user.selectOptions(
      screen.getByLabelText("Demonstration dataset"),
      "sport",
    );
fireEvent.change(screen.getByLabelText("Border width (px)"), {
          target: { value: "4" },
        });
        await user.click(screen.getByRole("radio", { name: "Fades" }));
fireEvent.change(screen.getByLabelText("Gap (px)"), {
          target: { value: "80" },
        });
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
    expect(screen.getByLabelText("Border width (px)")).toHaveValue("1");
    expect(screen.getByTestId("preview-boundary")).toHaveAttribute(
      "data-viewport",
      "desktop",
    );
    await user.click(screen.getByRole("radio", { name: "Fades" }));
    expect(screen.getByLabelText("Gap (px)")).toHaveValue("96");
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
    render(<Playground reduceMotion={false} colorResolver={colorResolver} />);
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
      gap: 96,
      speed: 1,
    });
expect(screen.queryByTestId("preview-slider-frame")).not.toBeInTheDocument();
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
        colorResolver={colorResolver}
        datasets={{ core: [], sport: [], food: [] }}
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
        colorResolver={colorResolver}
        datasets={{ core: duplicate, sport: duplicate, food: duplicate }}
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
    render(<Playground reduceMotion={false} colorResolver={colorResolver} />);
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
    render(<Playground reduceMotion={false} colorResolver={colorResolver} />);
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
    render(<Playground reduceMotion={false} colorResolver={colorResolver} />);
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
        <Playground reduceMotion={false} colorResolver={colorResolver} />
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
    render(<Playground reduceMotion={false} colorResolver={colorResolver} />);
fireEvent.change(screen.getByLabelText("Border width (px)"), {
          target: { value: "4" },
        });
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
    render(<Playground reduceMotion={false} colorResolver={colorResolver} />);
    await user.click(screen.getByRole("radio", { name: "Fades" }));
    sliderControl.shouldThrow = true;
fireEvent.change(screen.getByLabelText("Gap (px)"), {
          target: { value: "80" },
        });
        expect(screen.getByRole("alert")).toBeVisible();
    sliderControl.shouldThrow = false;
    await user.click(
      screen.getByRole("button", { name: "Reset settings and retry" }),
    );
    expect(screen.getByRole("radio", { name: "Running" })).toBeChecked();
expect(screen.getByLabelText("Border width (px)")).toHaveValue("1");
    expect(screen.getByRole("heading", { name: "Live preview" })).toHaveFocus();
    consoleError.mockRestore();
  });
});
