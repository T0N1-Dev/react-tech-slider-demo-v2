import type { Brand } from "react-tech-slider";
import type { SliderInvocation } from "./model";

export function generateSliderCode(invocation: SliderInvocation): string {
	return renderSliderCode(invocation);
}

function renderSliderCode(invocation: SliderInvocation): string {
	const brandLines = invocation.dataset.flatMap(serializeBrand);
	const propLines = invocation.props
		.filter(({ source }) => source === "always")
		.map(({ name, value }) =>
			typeof value === "string"
				? `      ${name}=${JSON.stringify(value)}`
				: `      ${name}={${JSON.stringify(value)}}`,
		);
	const variantLine =
		invocation.variant === "fades" ? '      variant="fades"' : null;
	const sliderLines = [
		"    <Slider",
		"      brandsList={brands}",
		...(variantLine ? [variantLine] : []),
		...propLines,
		"    />",
	];

	return [
		'import { Slider, type Brand } from "react-tech-slider";',
		"",
		"const brands: Brand[] = [",
		...brandLines,
		"];",
		"",
		"export function SliderExample() {",
		"  return (",
		...sliderLines,
		"  );",
		"}",
		"",
	].join("\n");
}

function serializeBrand(brand: Brand): string[] {
	return [
		"  {",
		`    id: ${brand.id},`,
		`    name: ${JSON.stringify(brand.name)},`,
		`    img: ${JSON.stringify(brand.img)},`,
		...(brand.width === undefined ? [] : [`    width: ${brand.width},`]),
		...(brand.height === undefined ? [] : [`    height: ${brand.height},`]),
		...(brand.style === undefined
			? []
			: [`    style: ${serializeStyle(brand.style)},`]),
		...(brand.className === undefined
			? []
			: [`    className: ${JSON.stringify(brand.className)},`]),
		"  },",
	];
}

function serializeStyle(style: NonNullable<Brand["style"]>): string {
	const entries = Object.entries(style).map(
		([key, value]) => `${serializeStyleKey(key)}: ${serializeStyleValue(value)}`,
	);
	return `{${entries.length === 0 ? "" : ` ${entries.join(", ")} `}}`;
}

function serializeStyleKey(key: string): string {
	return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
}

function serializeStyleValue(value: unknown): string {
	if (typeof value === "string") return JSON.stringify(value);
	if (typeof value === "number" && Number.isFinite(value)) return String(value);
	throw new Error("Brand style values must be strings or finite numbers.");
}
