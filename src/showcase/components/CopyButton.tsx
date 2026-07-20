import { useEffect, useRef, useState } from "react";

type CopyStatus =
	| { state: "idle" }
	| { state: "success"; message: string }
	| { state: "error"; message: string };

interface CopyButtonProps {
	text: string;
	targetLabel: string;
}

const SUCCESS_DURATION_MS = 2000;

export function CopyButton({ text, targetLabel }: CopyButtonProps) {
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

	return (
		<div className="copy-block" data-state={status.state}>
			<code className="source-code" tabIndex={0}>
				{text}
			</code>
			<button className="copy-button" type="button" onClick={copy}>
				Copy {targetLabel}
			</button>
			<span className="copy-feedback" aria-live="polite">
				{status.state === "idle" ? "" : status.message}
			</span>
		</div>
	);
}
