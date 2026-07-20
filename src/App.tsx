import { createElement } from "react";
import { InstallGuide } from "./showcase/components/InstallGuide";
import { Playground } from "./showcase/components/Playground";
import {
	PACKAGE_NAME,
	PACKAGE_URL,
	REPOSITORY_URL,
} from "./showcase/constants";

const FADES_LIMITATION =
	"The fades variant cannot be paused through the current public API. This showcase does not claim full reduced-motion support.";

function App() {
	return (
		<div className="site-shell">
			<header className="site-hero">
				<p className="eyebrow">{PACKAGE_NAME}</p>
				<h1>Evaluate react-tech-slider in one place</h1>
				<p className="hero-summary">
					Tune the published React slider, inspect the matching TypeScript, and
					copy the exact install command without leaving the page.
				</p>
				{createElement(
					"a",
					{ href: "#playground", className: "primary-link" },
					"Try the live playground",
				)}
				<nav className="resource-link-group" aria-label="Hero package resources">
					{createElement(
						"a",
						{ href: PACKAGE_URL, className: "resource-link" },
						"npm package",
					)}
					{createElement(
						"a",
						{ href: REPOSITORY_URL, className: "resource-link" },
						"Repository",
					)}
				</nav>
			</header>

			<main className="site-main">
				<div id="playground" className="playground-region" tabIndex={-1}>
					<Playground />
				</div>

				<InstallGuide />

				<section
					className="content-section api-guide"
					aria-labelledby="api-heading"
				>
					<h2 id="api-heading" className="section-heading">
						Adopt the public API
					</h2>
					<p>
						Use only package-root exports. The generated example and live
						preview share one canonical invocation, so the code you copy matches
						the settings you evaluated.
					</p>
					<p>Do not import internal modules or CSS subpaths.</p>
					<pre className="api-import" tabIndex={0}>
						<code>
							{'import { Slider, type Brand } from "react-tech-slider";'}
						</code>
					</pre>
					<h3>Choose the behavior that fits</h3>
					<dl className="variant-grid">
						<div>
							<dt>Running</dt>
							<dd>Continuous movement with playback and hover controls.</dd>
						</div>
						<div>
							<dt>Fades</dt>
							<dd>
								Stepped logo transitions configured through speed and gap.
							</dd>
						</div>
					</dl>
					<p className="limitation-note" role="note">
						{FADES_LIMITATION}
					</p>
				</section>
			</main>

			<footer className="site-footer">
				<p>{PACKAGE_NAME} showcase — evaluate, copy, and adopt.</p>
				<nav className="resource-link-group" aria-label="Footer package resources">
					{createElement(
						"a",
						{ href: PACKAGE_URL, className: "resource-link" },
						"npm package",
					)}
					{createElement(
						"a",
						{ href: REPOSITORY_URL, className: "resource-link" },
						"Repository",
					)}
				</nav>
			</footer>
		</div>
	);
}

export default App;
