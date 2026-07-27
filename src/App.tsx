import { createElement } from "react";
import { Slider } from "react-tech-slider";
import { InstallGuide } from "./showcase/components/InstallGuide";
import { Playground } from "./showcase/components/Playground";
import {
  PACKAGE_NAME,
  PACKAGE_URL,
  REPOSITORY_URL,
} from "./showcase/constants";

const brands = [
  {
    id: 1,
    name: "React",
    img: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
  },
  {
    id: 2,
    name: "CSS",
    img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1746640784/purple-css-logo_xufnis.webp",
    style: { width: "300px" },
  },
  {
    id: 3,
    name: "npm",
    img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1785109501/idTOrUuxMp_1785109477561_igg5qy.png",
  },
  {
    id: 4,
    name: "pnpm",
    img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1785109590/idSg9uh2Xf_logos_ulcihj.png",
    style: { width: "300px" },
  },
  {
    id: 5,
    name: "github",
    img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1739393991/github_ualv1s.png",
  },
];

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
          brandsList={brands}
          borderWidth={0}
          backgroundColor="transparent"
          iconWidth={20}
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
