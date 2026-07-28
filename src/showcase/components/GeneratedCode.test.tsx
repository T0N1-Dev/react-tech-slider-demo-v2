import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GeneratedCode } from "./GeneratedCode";

const SOURCE = `import { Slider } from "react-tech-slider";
const brands = [{ name: "<script>& unsafe", img: "https://example.test/a.svg" }];
return <Slider brandsList={brands} iconWidth={5} />;
`;

afterEach(() => {
  vi.restoreAllMocks();
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: undefined,
  });
});

describe("GeneratedCode", () => {
  it("renders a labelled focusable read-only line model with React nodes", () => {
    render(<GeneratedCode source={SOURCE} />);
    const section = screen.getByRole("heading", { name: "Generated code" }).closest("section");
    if (!section) throw new Error("Generated section missing");
    const viewer = section.querySelector("pre.source-viewer");
    const code = screen.getByTestId("generated-source");
    expect(viewer).toHaveAttribute("aria-labelledby", "generated-code-heading");
    expect(viewer).toHaveAttribute("tabindex", "0");
expect(viewer).toContainElement(code);
     expect(viewer?.closest(".copy-block")).toHaveClass("copy-block--stacked");
     expect(viewer?.closest(".copy-block")).toContainElement(
       screen.getByRole("button", { name: "Copy generated code" }),
     );
     expect(document.querySelectorAll(".source-viewer")).toHaveLength(1);
     expect(document.querySelector(".source-code")).not.toBeInTheDocument();
     expect(code).not.toHaveAttribute("contenteditable");
    expect(section.querySelector("textarea")).not.toBeInTheDocument();
    expect(section.querySelectorAll(".source-line")).toHaveLength(SOURCE.split("\n").length);
    const numbers = section.querySelectorAll(".source-line-number");
    expect([...numbers].map((node) => node.textContent)).toEqual(["1", "2", "3", "4"]);
    expect([...numbers].every((node) => node.getAttribute("aria-hidden") === "true")).toBe(true);
  });

  it("reconstructs exact visible source and renders bounded token hooks safely", () => {
    render(<GeneratedCode source={SOURCE} />);
    const code = screen.getByTestId("generated-source");
    const contents = [...code.querySelectorAll(".source-line-content")]
      .map((node) => node.textContent)
      .join("\n");
    expect(contents).toBe(SOURCE);
    expect(code.querySelectorAll("[data-token-kind]").length).toBeGreaterThan(0);
    expect(
      [...code.querySelectorAll('[data-token-kind="string"]')].some((node) =>
        node.textContent?.includes("<script>& unsafe"),
      ),
    ).toBe(true);
    expect(document.querySelector("script")).not.toBeInTheDocument();
    expect(code.innerHTML).not.toContain("<script>");
  });

  it("copies the original source without line numbers or presentation markup", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    render(<GeneratedCode source={SOURCE} />);

    await user.click(screen.getByRole("button", { name: "Copy generated code" }));
    expect(writeText).toHaveBeenCalledOnce();
    expect(writeText).toHaveBeenCalledWith(SOURCE);
    expect(within(screen.getByTestId("generated-source")).queryByRole("button")).not.toBeInTheDocument();
  });
});
