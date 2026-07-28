export interface ResolvedCssColor {
	canonical: string;
	pickerHex: string;
}
export type CssColorResolver = (candidate: string) => ResolvedCssColor | null;
export interface ResolvedColorProbe {
	color: string;
	remove: () => void;
}
export interface CssColorBrowserBoundary {
	resolveConcreteColor: (candidate: string) => ResolvedColorProbe | null;
	sampleSrgb: (color: string, sentinel: string) => readonly number[] | null;
}
const CONTEXT_DEPENDENT_COLORS = new Set([
	"currentcolor",
	"inherit",
	"initial",
	"unset",
	"revert",
	"revert-layer",
]);
const HEX_COLOR = /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const SAMPLE_SENTINELS = ["#010203", "#fefdfc"] as const;

type RgbaBytes = readonly [number, number, number, number];
function projectHexColor(candidate: string): string | null {
	const match = HEX_COLOR.exec(candidate);
	if (!match) {
		return null;
	}
	const digits = match[1]!.toLowerCase();
	if (digits.length === 3 || digits.length === 4) {
		const expanded = [...digits].map((digit) => digit.repeat(2)).join("");
		return `#${expanded}${digits.length === 3 ? "ff" : ""}`;
	}

	return `#${digits}${digits.length === 6 ? "ff" : ""}`;
}

function normalizeSample(sample: readonly number[] | null): RgbaBytes | null {
	if (!sample || sample.length < 4) {
		return null;
	}

	const bytes = sample.slice(0, 4).map((channel) => {
		if (!Number.isFinite(channel) || channel < 0 || channel > 255) {
			return null;
		}
		return Math.round(channel);
	});

	if (bytes.some((channel) => channel === null)) {
		return null;
	}
	return bytes as unknown as RgbaBytes;
}

function samplesEqual(first: RgbaBytes, second: RgbaBytes): boolean {
	return first.every((channel, index) => channel === second[index]);
}

function bytesToHex(bytes: RgbaBytes): string {
	return `#${bytes.map((byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

const browserBoundary: CssColorBrowserBoundary = {
	resolveConcreteColor(candidate) {
		if (
			typeof document === "undefined" ||
			typeof getComputedStyle === "undefined"
		) {
			return null;
		}

		const parent = document.body ?? document.documentElement;
		if (!parent) {
			return null;
		}
		const probe = document.createElement("span");
		let appended = false;
		let ownershipTransferred = false;

		try {
			probe.style.position = "absolute";
			probe.style.inlineSize = "0";
			probe.style.blockSize = "0";
			probe.style.overflow = "hidden";
			probe.style.clipPath = "inset(50%)";
			probe.style.pointerEvents = "none";
			probe.style.color = "";
			probe.style.color = candidate;
			if (!probe.style.color) {
				return null;
			}

			parent.appendChild(probe);
			appended = true;
			const color = getComputedStyle(probe).color;
			if (!color) {
				return null;
			}

			ownershipTransferred = true;
			return {
				color,
				remove: () => probe.remove(),
			};
		} catch {
			return null;
		} finally {
			if (appended && !ownershipTransferred) {
				probe.remove();
			}
		}
	},

	sampleSrgb(color, sentinel) {
		if (typeof document === "undefined") {
			return null;
		}

		try {
			const canvas = document.createElement("canvas");
			canvas.width = 1;
			canvas.height = 1;
			const context = canvas.getContext("2d", {
				colorSpace: "srgb",
				willReadFrequently: true,
			});
			if (!context) {
				return null;
			}
			context.clearRect(0, 0, 1, 1);
			context.fillStyle = sentinel;
			context.fillStyle = color;
			context.fillRect(0, 0, 1, 1);
			const data = context.getImageData(0, 0, 1, 1).data;
			return [data[0]!, data[1]!, data[2]!, data[3]!];
		} catch {
			return null;
		}
	},
};

export function resolveCssColor(
	candidate: string,
	boundary: CssColorBrowserBoundary = browserBoundary,
): ResolvedCssColor | null {
	const canonical = candidate.trim();
	if (
		!canonical ||
		CONTEXT_DEPENDENT_COLORS.has(canonical.toLowerCase()) ||
		/var\(/i.test(canonical)
	) {
		return null;
	}

	const pickerHex = projectHexColor(canonical);
	if (pickerHex) {
		return { canonical, pickerHex };
	}

	let probe: ResolvedColorProbe | null;
	try {
		probe = boundary.resolveConcreteColor(canonical);
	} catch {
		return null;
	}
	if (!probe) {
		return null;
	}
	let resolved: ResolvedCssColor | null = null;
	let cleanupFailed = false;
	try {
		const first = normalizeSample(
			boundary.sampleSrgb(probe.color, SAMPLE_SENTINELS[0]),
		);
		const second = normalizeSample(
			boundary.sampleSrgb(probe.color, SAMPLE_SENTINELS[1]),
		);
		if (first && second && samplesEqual(first, second)) {
			resolved = { canonical, pickerHex: bytesToHex(first) };
		}
	} catch {
		resolved = null;
	} finally {
		try {
			probe.remove();
		} catch {
			cleanupFailed = true;
		}
	}

	return cleanupFailed ? null : resolved;
}
