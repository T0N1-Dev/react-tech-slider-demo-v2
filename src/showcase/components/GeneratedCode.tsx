import { CopyButton } from "./CopyButton";

interface GeneratedCodeProps {
	source: string;
}

export function GeneratedCode({ source }: GeneratedCodeProps) {
	return (
		<section
			className="generated-code"
			aria-labelledby="generated-code-heading"
		>
			<h3 id="generated-code-heading" className="subsection-heading">
				Generated code
			</h3>
			<CopyButton text={source} targetLabel="generated code" />
		</section>
	);
}
