import { useEffect, useRef, useState, type ReactNode } from "react";

type CopyStatus =
	| { state: "idle" }
	| { state: "success"; message: string }
	| { state: "error"; message: string };

interface CopyButtonProps {
	text: string;
	targetLabel: string;
	presentation?: "stacked" | "inline-field" | "terminal";
	children: ReactNode;
}

const SUCCESS_DURATION_MS = 2000;

export function CopyButton({
	text,
	targetLabel,
	presentation = "stacked",
	children,
}: CopyButtonProps) {
	const targetName = `${targetLabel.charAt(0).toUpperCase()}${targetLabel.slice(1)}`;
	const successMessage = `${targetName} copied to clipboard.`;
	const errorMessage = `Copy failed for ${targetLabel}. Select and copy the text manually.`;
	const [status, setStatus] = useState<CopyStatus>({ state: "idle" });
	const timeoutRef = useRef<number | null>(null);
	const requestRef = useRef(0);
	const mountedRef = useRef(true);

	useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
			requestRef.current += 1;
			if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
		};
	}, []);

	const clearSuccessTimeout = () => {
		if (timeoutRef.current === null) return;
		window.clearTimeout(timeoutRef.current);
		timeoutRef.current = null;
	};

	const copy = async () => {
		const request = ++requestRef.current;
		clearSuccessTimeout();
		setStatus({ state: "idle" });
		try {
			const writeText = navigator.clipboard?.writeText;
			if (typeof writeText !== "function")
				throw new Error("Clipboard unavailable");
			await Promise.resolve(writeText.call(navigator.clipboard, text));
			if (!mountedRef.current || requestRef.current !== request) return;
			setStatus({ state: "success", message: successMessage });
			timeoutRef.current = window.setTimeout(() => {
				if (!mountedRef.current || requestRef.current !== request) return;
				timeoutRef.current = null;
				setStatus({ state: "idle" });
			}, SUCCESS_DURATION_MS);
		} catch {
			if (!mountedRef.current || requestRef.current !== request) return;
			setStatus({ state: "error", message: errorMessage });
		}
	};

	const button =
		presentation === "terminal" ? (
			<button
				className="copy-button copy-button--icon"
				type="button"
				onClick={copy}
				aria-label={`Copy ${targetLabel}`}
				title={`Copy ${targetLabel}`}
			>
				<svg aria-hidden="true" viewBox="0 0 640 640" focusable="false">
					<path d="M288 64C252.7 64 224 92.7 224 128L224 384C224 419.3 252.7 448 288 448L480 448C515.3 448 544 419.3 544 384L544 183.4C544 166 536.9 149.3 524.3 137.2L466.6 81.8C454.7 70.4 438.8 64 422.3 64L288 64zM160 192C124.7 192 96 220.7 96 256L96 512C96 547.3 124.7 576 160 576L352 576C387.3 576 416 547.3 416 512L416 496L352 496L352 512L160 512L160 256L176 256L176 192L160 192z" />
				</svg>
			</button>
		) : (
			<button className="copy-button" type="button" onClick={copy}>
				Copy {targetLabel}
			</button>
		);

	return (
		<div
			className={`copy-block copy-block--${presentation}`}
			data-state={status.state}
		>
			{presentation === "inline-field" || presentation === "terminal" ? (
				<div className="install-command-field">
					{children}
					{button}
				</div>
			) : (
				<>
					{children}
					{button}
				</>
			)}
			<span className="copy-feedback" aria-live="polite">
				{status.state === "idle" ? "" : status.message}
			</span>
		</div>
	);
}
