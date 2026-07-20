import { createElement, useRef, useState } from "react";
import {
	INSTALL_COMMANDS,
	PACKAGE_URL,
	REPOSITORY_URL,
	type PackageManager,
} from "../constants";
import { CopyButton } from "./CopyButton";

const MANAGERS: readonly PackageManager[] = ["npm", "pnpm"];
const PANEL_ID = "install-command-panel";

export function InstallGuide() {
	const [selected, setSelected] = useState<PackageManager>("npm");
	const tabRefs = useRef<Partial<Record<PackageManager, HTMLButtonElement>>>(
		{},
	);
	const command = INSTALL_COMMANDS[selected];

	const selectAndFocus = (manager: PackageManager) => {
		setSelected(manager);
		tabRefs.current[manager]?.focus();
	};

	const handleKeyDown = (
		event: React.KeyboardEvent<HTMLButtonElement>,
		manager: PackageManager,
	) => {
		const currentIndex = MANAGERS.indexOf(manager);
		let next: PackageManager | undefined;
		switch (event.key) {
			case "ArrowRight":
				next = MANAGERS[(currentIndex + 1) % MANAGERS.length];
				break;
			case "ArrowLeft":
				next = MANAGERS[(currentIndex - 1 + MANAGERS.length) % MANAGERS.length];
				break;
			case "Home":
				next = MANAGERS[0];
				break;
			case "End":
				next = MANAGERS[MANAGERS.length - 1];
				break;
		}
		if (!next) return;
		event.preventDefault();
		selectAndFocus(next);
	};

	return (
		<section
			className="content-section install-guide"
			aria-labelledby="install-heading"
		>
			<h2 id="install-heading" className="section-heading">
				Install
			</h2>
			<div className="install-tabs" role="tablist" aria-label="Package manager">
				{MANAGERS.map((manager) => {
					const active = selected === manager;
					const tabId = `install-tab-${manager}`;
					return (
						<button
							key={manager}
							ref={(element) => {
								if (element) tabRefs.current[manager] = element;
							}}
							id={tabId}
							type="button"
							role="tab"
							aria-selected={active}
							aria-controls={PANEL_ID}
							tabIndex={active ? 0 : -1}
							onClick={() => setSelected(manager)}
							onKeyDown={(event) => handleKeyDown(event, manager)}
						>
							{manager}
							{active ? <span aria-hidden="true">✓ Selected</span> : null}
						</button>
					);
				})}
			</div>
			<div
				className="install-panel"
				id={PANEL_ID}
				role="tabpanel"
				aria-labelledby={`install-tab-${selected}`}
			>
				<CopyButton
					key={selected}
					text={command}
					targetLabel="install command"
				/>
			</div>
			<ul className="resource-links" aria-label="Package resources">
				<li>
					{createElement(
						"a",
						{ href: PACKAGE_URL, className: "resource-link" },
						"npm package",
					)}
				</li>
				<li>
					{createElement(
						"a",
						{ href: REPOSITORY_URL, className: "resource-link" },
						"Repository",
					)}
				</li>
			</ul>
		</section>
	);
}
