import { Fragment } from "react";
import { highlightGeneratedTsx } from "../sourceHighlight";
import { CopyButton } from "./CopyButton";

interface GeneratedCodeProps {
	source: string;
}

export function GeneratedCode({ source }: GeneratedCodeProps) {
	const lines = highlightGeneratedTsx(source);
	return (
		<section className="generated-code" aria-labelledby="generated-code-heading">
			<h3 id="generated-code-heading" className="subsection-heading">
				Generated code
			</h3>
			<CopyButton
				text={source}
				targetLabel="generated code"
				presentation="stacked"
			>
				<pre className="source-viewer" aria-labelledby="generated-code-heading" tabIndex={0}>
					<code data-testid="generated-source">
						{lines.map((line, lineIndex) => (
							<Fragment key={line.number}>
								<span className="source-line">
									<span className="source-line-number" data-line-number={line.number} aria-hidden="true">
										{line.number}
									</span>
									<span className="source-line-content">
										{line.tokens.map((token, tokenIndex) => (
											<span key={tokenIndex} className={`source-token--${token.kind}`} data-token-kind={token.kind}>
												{token.text}
											</span>
										))}
									</span>
								</span>
								{lineIndex < lines.length - 1 ? "\n" : null}
							</Fragment>
						))}
					</code>
				</pre>
			</CopyButton>
		</section>
	);
}
