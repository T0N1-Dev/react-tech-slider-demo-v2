import { describe, expect, it } from "vitest";
import { FOOD_BRANDS, SPORT_BRANDS } from "./brands";
import { generateSliderCode } from "./codegen";
import { createInitialState, projectSlider } from "./model";
import { highlightGeneratedTsx } from "./sourceHighlight";
type ExpectedKind =
  | "plain"
  | "comment"
  | "string"
  | "keyword"
  | "tag"
  | "attribute"
  | "number"
  | "punctuation";
interface ExpectedLine {
  number: number;
  text: string;
  tokens: readonly { kind: ExpectedKind; text: string }[];
}
const SAMPLE = `import { Slider, type Brand } from "react-tech-slider";
/* opening
still comment */ const brands = [{ id: 10, name: "Dunkin\\" & < \`Donuts" }];
export function Example() {
  // package-root component
  return (<Slider iconWidth={5} borderColor="#abc" />);
}
`;
function reconstruct(source: string) {
  const lines = highlightGeneratedTsx(source) as readonly ExpectedLine[];
  return lines.map((line) => line.tokens.map((token) => token.text).join("")).join("\n");
}

describe("highlightGeneratedTsx", () => {
  it("builds exact sequential lines including a trailing empty line", () => {
    const lines = highlightGeneratedTsx(SAMPLE) as readonly ExpectedLine[];
    expect(lines).toHaveLength(SAMPLE.split("\n").length);
    expect(lines.map(({ number }) => number)).toEqual(
      SAMPLE.split("\n").map((_, index) => index + 1),
    );
    expect(lines.map(({ text }) => text)).toEqual(SAMPLE.split("\n"));
    expect(reconstruct(SAMPLE)).toBe(SAMPLE);
    expect(lines.at(-1)).toMatchObject({ text: "", tokens: [] });
  });
  it("emits every bounded token kind without changing characters", () => {
    const lines = highlightGeneratedTsx(SAMPLE) as readonly ExpectedLine[];
    const tokens = lines.flatMap(({ tokens }) => tokens);
    const kinds = new Set(tokens.map(({ kind }) => kind));
    const expected: ExpectedKind[] = [
      "plain",
      "comment",
      "string",
      "keyword",
      "tag",
      "attribute",
      "number",
      "punctuation",
    ];
    expect([...kinds].sort()).toEqual([...expected].sort());
    expect(tokens.some(({ kind, text }) => kind === "tag" && text === "Slider")).toBe(true);
    expect(tokens.some(({ kind, text }) => kind === "attribute" && text === "iconWidth")).toBe(true);
    expect(tokens.some(({ kind, text }) => kind === "number" && text === "10")).toBe(true);
  });
  it("carries only block comments and respects strings, escapes, and line comments", () => {
    const lines = highlightGeneratedTsx(SAMPLE) as readonly ExpectedLine[];
    expect(lines[1]?.tokens.every(({ kind }) => kind === "comment")).toBe(true);
    expect(lines[2]?.tokens[0]).toMatchObject({ kind: "comment", text: "still comment */" });
    expect(lines[2]?.tokens.some(({ kind, text }) =>
      kind === "string" && text.includes("Dunkin\\\"") && text.includes("& < `"),
    )).toBe(true);
    expect(lines[4]?.tokens.some(({ kind }) => kind === "comment")).toBe(true);
  });
  it("handles closing tags, adjacent punctuation, decimals, ampersands, and long URLs", () => {
    const longUrl = `https://example.test/${"segment/".repeat(80)}asset.svg?x=1&y=2`;
    const source = `return (</Slider>);\nconst item = { speed: 0.25, img: "${longUrl}" };`;
    const lines = highlightGeneratedTsx(source) as readonly ExpectedLine[];
    expect(reconstruct(source)).toBe(source);
    expect(lines[0]?.tokens.some(({ kind, text }) => kind === "tag" && text === "Slider")).toBe(true);
    expect(lines[1]?.tokens.some(({ kind, text }) => kind === "number" && text === "0.25")).toBe(true);
    expect(lines[1]?.tokens.some(({ kind, text }) => kind === "string" && text.includes("&y=2"))).toBe(true);
    for (const line of lines) {
      expect(line.tokens.some((token, index) => token.kind === line.tokens[index - 1]?.kind)).toBe(false);
    }
  });
  it.each([[SPORT_BRANDS], [FOOD_BRANDS]] as const)("reconstructs generated showcase source", (brands) => {
    const result = projectSlider(createInitialState(false), brands);
    if (result.status !== "ready") throw new Error("Expected ready invocation");
    const source = generateSliderCode(result.invocation);
    expect(reconstruct(source)).toBe(source);
    expect(source).toContain('from "react-tech-slider"');
  });
});
