export const PACKAGE_NAME = "react-tech-slider";
export const PACKAGE_URL = `https://www.npmjs.com/package/${PACKAGE_NAME}`;
export const REPOSITORY_URL = "https://github.com/T0N1-Dev/react-tech-slider";

export const INSTALL_COMMANDS = {
	npm: `npm install ${PACKAGE_NAME}`,
	pnpm: `pnpm add ${PACKAGE_NAME}`,
} as const;

export const PREVIEW_WIDTHS = {
	desktop: 960,
	tablet: 768,
	mobile: 390,
} as const;

export type PackageManager = keyof typeof INSTALL_COMMANDS;
