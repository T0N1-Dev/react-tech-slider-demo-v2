import { createElement } from "react";
import { Slider } from "react-tech-slider";
import { CORE_BRANDS } from "./showcase/brands";
import { InstallGuide } from "./showcase/components/InstallGuide";
import { Playground } from "./showcase/components/Playground";
import {
  PACKAGE_NAME,
  PACKAGE_URL,
  REPOSITORY_URL,
} from "./showcase/constants";

function App() {
  return (
    <div className="site-shell">
      <section className="hero-shell">
        <header className="site-hero">
          <p className="eyebrow">{PACKAGE_NAME}</p>
          <h1>Evaluate react-tech-slider in one place</h1>
          <p className="hero-summary">
            Tune the component, inspect the props, and copy the exact install
            command without leaving the page.
          </p>
          {createElement(
            "a",
            { href: "#playground", className: "primary-link" },
            "Try the live playground",
          )}
          <nav
            className="resource-link-group"
            aria-label="Hero package resources"
          >
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
        <Slider
          brandsList={CORE_BRANDS}
          borderWidth={0}
          backgroundColor="transparent"
          iconWidth={18}
          className="hero-slider"
          durationMs={15000}
          pauseOnHoverActive
        />
      </section>

      <main className="site-main">
        <div id="playground" className="playground-region" tabIndex={-1}>
          <Playground />
        </div>

        <InstallGuide />
      </main>

      <footer className="site-footer">
        <p>{PACKAGE_NAME} showcase — evaluate, copy, and adopt.</p>
        <nav
          className="resource-link-group"
          aria-label="Footer package resources"
        >
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
