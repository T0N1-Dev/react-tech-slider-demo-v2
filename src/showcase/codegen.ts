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
		"  },",
	];
}
