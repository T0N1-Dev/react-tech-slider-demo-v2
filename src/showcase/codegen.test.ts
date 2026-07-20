import path from "node:path";
import type { Brand } from "react-tech-slider";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import * as codegen from "./codegen";
import { generateSliderCode } from "./codegen";
import { createInitialState, projectSlider } from "./model";

const BRANDS = [
	{
		id: 1,
		name: "TypeScript",
		img: "https://example.com/typescript.svg",
	},
	{
		id: 2,
		name: "React",
		img: "https://example.com/react.svg",
	},
] satisfies Brand[];

const DEFAULT_RUNNING_SOURCE = `import { Slider, type Brand } from "react-tech-slider";

const brands: Brand[] = [
  {
    id: 1,
    name: "TypeScript",
    img: "https://example.com/typescript.svg",
  },
  {
    id: 2,
    name: "React",
    img: "https://example.com/react.svg",
  },
];

export function SliderExample() {
  return (
    <Slider
      brandsList={brands}
      iconWidth={5}
    />
  );
}
`;

function readyInvocation(
	state = createInitialState(false),
	brands: readonly Brand[] = BRANDS,
) {
	const result = projectSlider(state, brands);
	if (result.status !== "ready") throw new Error("Expected ready invocation");
	return result.invocation;
}

function compileGeneratedTsx(fixtureName: string, source: string) {
	const fileName = path.resolve(`src/showcase/${fixtureName}.tsx`);
	const options: ts.CompilerOptions = {
		target: ts.ScriptTarget.ES2022,
		module: ts.ModuleKind.ESNext,
		moduleResolution: ts.ModuleResolutionKind.Bundler,
		jsx: ts.JsxEmit.ReactJSX,
		strict: true,
		skipLibCheck: true,
		noEmit: true,
		verbatimModuleSyntax: true,
	};
	const host = ts.createCompilerHost(options);
	const originalGetSourceFile = host.getSourceFile.bind(host);
	const originalFileExists = host.fileExists.bind(host);
	const originalReadFile = host.readFile.bind(host);
	host.fileExists = (candidate) =>
		path.resolve(candidate) === fileName || originalFileExists(candidate);
	host.readFile = (candidate) =>
		path.resolve(candidate) === fileName ? source : originalReadFile(candidate);
	host.getSourceFile = (candidate, languageVersion, onError, shouldCreate) =>
		path.resolve(candidate) === fileName
			? ts.createSourceFile(
					fileName,
					source,
					languageVersion,
					true,
					ts.ScriptKind.TSX,
				)
			: originalGetSourceFile(
					candidate,
					languageVersion,
					onError,
					shouldCreate,
				);
	const program = ts.createProgram({ rootNames: [fileName], options, host });
	return ts.getPreEmitDiagnostics(program).map((diagnostic) =>
		ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
	);
}

describe("slider source generation", () => {
	it("renders the exact minimal default running snippet", () => {
		expect(generateSliderCode(readyInvocation())).toBe(DEFAULT_RUNNING_SOURCE);
	});

	it("exposes only the canonical invocation renderer at runtime", () => {
		expect(Object.keys(codegen).sort()).toEqual(["generateSliderCode"]);
	});

	it(
		"rejects the exported uncorrelated renderer bypass at type level",
		() => {
			const diagnostics = compileGeneratedTsx(
				"invalid-code-model",
				`import { renderSliderCode } from "./codegen";

renderSliderCode({
  variant: "fades",
  brands: [],
  props: [{ name: "borderWidth", value: 1, source: "always" }],
});
`,
			);
			expect(diagnostics.join("\n")).toMatch(
				/renderSliderCode|no exported member/i,
			);
		},
		15000,
	);

	it(
		"rejects fades with running entries through the canonical renderer",
		() => {
			const diagnostics = compileGeneratedTsx(
				"invalid-canonical-invocation",
				`import { generateSliderCode } from "./codegen";

generateSliderCode({
  variant: "fades",
  dataset: [],
  props: [{ name: "borderWidth", value: 1, source: "always" }],
});
`,
			);
			expect(diagnostics.join("\n")).toMatch(/borderWidth|FadesPropEntry/i);
		},
		15000,
	);

	it("emits all non-default running values with numeric and boolean JSX expressions", () => {
		const state = {
			...createInitialState(false),
			running: {
				borderWidth: 3,
				borderColor: "rebeccapurple",
				backgroundColor: "transparent",
				isPlay: false,
				pauseOnHoverActive: true,
				durationMs: 45000,
			},
		};
		const source = generateSliderCode(readyInvocation(state));
		expect(source).toContain("iconWidth={5}");
		expect(source).toContain("borderWidth={3}");
		expect(source).toContain('borderColor="rebeccapurple"');
		expect(source).toContain('backgroundColor="transparent"');
		expect(source).toContain("isPlay={false}");
		expect(source).toContain("pauseOnHoverActive={true}");
		expect(source).toContain("durationMs={45000}");
		expect(source).not.toMatch(/(?:iconWidth|borderWidth|durationMs)="/);
	});

	it("emits fades with its discriminator, controlled width/gap, and default-speed omission", () => {
		const state = { ...createInitialState(false), variant: "fades" as const };
		const source = generateSliderCode(readyInvocation(state));
		expect(source).toContain('variant="fades"');
		expect(source).toContain("iconWidth={5}");
		expect(source).toContain("gap={48}");
		expect(source).not.toContain("speed=");
		expect(source).not.toContain("borderWidth");
		expect(source).not.toContain("isPlay");
	});

	it("emits a non-default fades speed as a numeric expression", () => {
		const state = {
			...createInitialState(false),
			variant: "fades" as const,
			fades: { gap: 80, speed: 1.5 },
		};
		const source = generateSliderCode(readyInvocation(state));
		expect(source).toContain("gap={80}");
		expect(source).toContain("speed={1.5}");
		expect(source).not.toContain('speed="1.5"');
	});

	it("serializes canonical brand identity, order, escaping, and dimensions", () => {
		const brands = [
			{
				id: 8,
				name: 'Quoted "Brand"',
				img: "https://example.com/quoted.svg",
				width: 6,
				height: 4,
			},
			{ id: 9, name: "Second", img: "https://example.com/second.svg" },
		] satisfies Brand[];
		const source = generateSliderCode(readyInvocation(undefined, brands));
		expect(source.indexOf("id: 8")).toBeLessThan(source.indexOf("id: 9"));
		expect(source).toContain('name: "Quoted \\"Brand\\""');
		expect(source).toContain("width: 6");
		expect(source).toContain("height: 4");
	});

	it("uses only the package root and excludes unsupported or transient names", () => {
		const running = generateSliderCode(readyInvocation());
		const fades = generateSliderCode(
			readyInvocation({ ...createInitialState(false), variant: "fades" }),
		);
		for (const source of [running, fades]) {
			expect(source).toContain('from "react-tech-slider"');
			expect(source).not.toContain("react-tech-slider/");
			expect(source).not.toMatch(/\bautoPlay=/);
			expect(source).not.toMatch(/\bpauseOnHover=/);
			expect(source).not.toMatch(/viewport|reset|clipboard|fallback|retry/i);
		}
		expect(running).not.toMatch(/\bspeed=/);
	});

	it.each([
		["generated-running", createInitialState(false)],
		[
			"generated-fades",
			{
				...createInitialState(false),
				variant: "fades" as const,
				fades: { gap: 80, speed: 1.5 },
			},
		],
	] as const)(
		"compiles %s against published package declarations",
		(name, state) => {
			const diagnostics = compileGeneratedTsx(
				name,
				generateSliderCode(readyInvocation(state)),
			);
			expect(diagnostics).toEqual([]);
		},
		15000,
	);
});
