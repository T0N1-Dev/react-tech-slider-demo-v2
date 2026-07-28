import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	INSTALL_COMMANDS,
	PACKAGE_NAME,
	PACKAGE_URL,
	PREVIEW_WIDTHS,
	REPOSITORY_URL,
} from "../constants";
import { InstallGuide } from "./InstallGuide";

function installClipboard(writeText: unknown) {
	Object.defineProperty(navigator, "clipboard", {
		configurable: true,
		value: writeText === undefined ? undefined : { writeText },
	});
}

afterEach(() => {
	vi.restoreAllMocks();
	installClipboard(undefined);
});

describe("InstallGuide", () => {
	it("defaults to npm and copies the exact npm command", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		const user = userEvent.setup();
		installClipboard(writeText);
		render(<InstallGuide />);

		const command = screen.getByText("npm install react-tech-slider");
		const field = command.closest(".install-command-field");
		const copyButton = screen.getByRole("button", {
			name: "Copy install command",
		});
		expect(command).toHaveClass("install-command-text");
		expect(field).toContainElement(command);
		expect(field).toContainElement(screen.getByLabelText("Terminal prompt"));
		expect(field).toContainElement(copyButton);
		expect(copyButton).toHaveAttribute("title", "Copy install command");
		expect(copyButton).toContainElement(copyButton.querySelector("svg"));
		expect(copyButton).toHaveTextContent("");
		expect(field?.querySelectorAll("button")).toHaveLength(1);
		await user.click(
			screen.getByRole("button", { name: "Copy install command" }),
		);
		expect(writeText).toHaveBeenCalledWith("npm install react-tech-slider");
	});

	it("uses centralized exact package metadata, commands, and preset widths", () => {
		expect(PACKAGE_NAME).toBe("react-tech-slider");
		expect(PACKAGE_URL).toBe("https://www.npmjs.com/package/react-tech-slider");
		expect(REPOSITORY_URL).toBe(
			"https://github.com/T0N1-Dev/react-tech-slider",
		);
		expect(INSTALL_COMMANDS).toEqual({
			npm: "npm install react-tech-slider",
			pnpm: "pnpm add react-tech-slider",
		});
		expect(PREVIEW_WIDTHS).toEqual({ desktop: 960, tablet: 768, mobile: 390 });
		render(<InstallGuide />);
		expect(screen.getByRole("link", { name: "npm package" })).toHaveAttribute(
			"href",
			PACKAGE_URL,
		);
		expect(screen.getByRole("link", { name: "Repository" })).toHaveAttribute(
			"href",
			REPOSITORY_URL,
		);
	});

	it("exposes automatic single-select tab and labeled panel semantics", () => {
		render(<InstallGuide />);
		const tablist = screen.getByRole("tablist", { name: "Package manager" });
		const npm = within(tablist).getByRole("tab", { name: "npm" });
		const pnpm = within(tablist).getByRole("tab", { name: "pnpm" });
		expect(npm).toHaveAttribute("aria-selected", "true");
		expect(npm).toHaveAttribute("tabindex", "0");
		expect(pnpm).toHaveAttribute("aria-selected", "false");
		expect(pnpm).toHaveAttribute("tabindex", "-1");
		const panel = screen.getByRole("tabpanel");
		expect(npm).toHaveAttribute("aria-controls", panel.id);
		expect(panel).toHaveAttribute("aria-labelledby", npm.id);
	});

	it("switches by click and copies exact pnpm guidance", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		const user = userEvent.setup();
		installClipboard(writeText);
		render(<InstallGuide />);
		await user.click(screen.getByRole("tab", { name: "pnpm" }));
		expect(screen.getByText("pnpm add react-tech-slider")).toBeVisible();
		expect(
			screen.queryByText("npm install react-tech-slider"),
		).not.toBeInTheDocument();
		await user.click(
			screen.getByRole("button", { name: "Copy install command" }),
		);
		expect(writeText).toHaveBeenLastCalledWith("pnpm add react-tech-slider");
	});

	it("automatically selects and focuses with Arrow keys including wrap", async () => {
		const user = userEvent.setup();
		render(<InstallGuide />);
		const npm = screen.getByRole("tab", { name: "npm" });
		const pnpm = screen.getByRole("tab", { name: "pnpm" });
		npm.focus();
		await user.keyboard("{ArrowRight}");
		expect(pnpm).toHaveFocus();
		expect(pnpm).toHaveAttribute("aria-selected", "true");
		await user.keyboard("{ArrowRight}");
		expect(npm).toHaveFocus();
		await user.keyboard("{ArrowLeft}");
		expect(pnpm).toHaveFocus();
	});

	it("uses Home and End for automatic endpoint selection", async () => {
		const user = userEvent.setup();
		render(<InstallGuide />);
		const npm = screen.getByRole("tab", { name: "npm" });
		const pnpm = screen.getByRole("tab", { name: "pnpm" });
		npm.focus();
		await user.keyboard("{End}");
		expect(pnpm).toHaveFocus();
		expect(pnpm).toHaveAttribute("aria-selected", "true");
		await user.keyboard("{Home}");
		expect(npm).toHaveFocus();
		expect(npm).toHaveAttribute("aria-selected", "true");
	});

	it("retains native Enter and Space activation", async () => {
		const user = userEvent.setup();
		render(<InstallGuide />);
		const npm = screen.getByRole("tab", { name: "npm" });
		const pnpm = screen.getByRole("tab", { name: "pnpm" });
		pnpm.focus();
		await user.keyboard("{Enter}");
		expect(pnpm).toHaveAttribute("aria-selected", "true");
		npm.focus();
		await user.keyboard(" ");
		expect(npm).toHaveAttribute("aria-selected", "true");
	});

	it("uses a visible non-color selected cue and retains local selection", async () => {
		const user = userEvent.setup();
		const { rerender } = render(<InstallGuide />);
		const pnpm = screen.getByRole("tab", { name: "pnpm" });
		await user.click(pnpm);
		expect(within(pnpm).getByText("✓")).toBeVisible();
		expect(
			within(screen.getByRole("tab", { name: "npm" })).queryByText("✓"),
		).not.toBeInTheDocument();
		rerender(<InstallGuide />);
		expect(screen.getByRole("tab", { name: "pnpm" })).toHaveAttribute(
			"aria-selected",
			"true",
		);
	});

	it("retains exact command and manual-copy feedback after clipboard rejection", async () => {
		const user = userEvent.setup();
		installClipboard(vi.fn().mockRejectedValue(new Error("denied")));
		render(<InstallGuide />);
		await user.click(
			screen.getByRole("button", { name: "Copy install command" }),
		);
		expect(screen.getByText(INSTALL_COMMANDS.npm)).toBeVisible();
		expect(
			screen.getByText(
				"Copy failed for install command. Select and copy the text manually.",
			),
		).toHaveAttribute("aria-live", "polite");
	});

	it("remounts copy status when the selected command changes", async () => {
		const user = userEvent.setup();
		installClipboard(vi.fn().mockResolvedValue(undefined));
		render(<InstallGuide />);
		await user.click(
			screen.getByRole("button", { name: "Copy install command" }),
		);
		expect(screen.getByText("Install command copied to clipboard.")).toBeVisible();
		await user.click(screen.getByRole("tab", { name: "pnpm" }));
		expect(
			screen.queryByText("Install command copied to clipboard."),
		).not.toBeInTheDocument();
		expect(screen.getByText(INSTALL_COMMANDS.pnpm)).toBeVisible();
	});
});
