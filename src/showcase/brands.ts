import type { Brand } from "react-tech-slider";

export const CORE_BRANDS = [
  { id: 1, name: "TypeScript", img: "https://cdn.simpleicons.org/typescript" },
  { id: 2, name: "React", img: "https://cdn.simpleicons.org/react" },
  {
    id: 3,
    name: "npm",
    img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1785109501/idTOrUuxMp_1785109477561_igg5qy.png",
  },
  {
    id: 4,
    name: "css",
    img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1746640784/purple-css-logo_xufnis.webp",
  },
  {
    id: 5,
    name: "GitHub",
    img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1739393991/github_ualv1s.png",
  },
  { id: 6, name: "pnpm", img: "https://cdn.simpleicons.org/pnpm" },
] as const satisfies Brand[];

export const SPORT_BRANDS = [
  {
    id: 1,
    name: "Puma",
    img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1744835609/puma-logo-logo-svgrepo-com_ylvldf.svg",
    style: { transition: "width 1s ease", filter: "invert()" },
    className: "puma-icon",
  },
  {
    id: 2,
    name: "Reebok",
    img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1744835608/reebok-crossfit_ger10e.svg",
    style: { transition: "width 1s ease", filter: "invert()" },
    className: "reebok-icon",
  },
  {
    id: 3,
    name: "Under Armour",
    img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1744835607/under-armour_ddci89.svg",
    style: { transition: "width 1s ease", filter: "invert()" },
    className: "under-armour",
  },
  {
    id: 4,
    name: "The North Face",
    img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1744835607/the-north-face_jql7qf.svg",
    style: { transition: "width 1s ease", filter: "invert()" },
    className: "northFace-icon",
  },
  {
    id: 5,
    name: "Nike",
    img: "https://img.icons8.com/ios-filled/500/nike.png",
    style: { transition: "width 1s ease", filter: "invert()" },
  },
  {
    id: 6,
    name: "Adidas",
    img: "https://img.icons8.com/ios-filled/500/adidas-trefoil.png",
    style: { transition: "width 1s ease", filter: "invert()" },
  },
] as const satisfies readonly Brand[];

export const FOOD_BRANDS = [
  {
    id: 1,
    name: "Burger King",
    img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111638/burger-king_eyaxzl.svg",
    style: { transition: "width 1s ease" },
  },
  {
    id: 2,
    name: "Oreo",
    img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111636/oreo_vfrh58.svg",
    style: { transition: "width 1s ease" },
  },
  {
    id: 3,
    name: "McDonalds",
    img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111635/mcdonalds_g2tuh2.svg",
    style: { transition: "width 1s ease" },
  },
  {
    id: 4,
    name: "KFC",
    img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111635/kfc_q9irnf.svg",
    style: { transition: "width 1s ease" },
  },
  {
    id: 5,
    name: "StarBucks",
    img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111635/starbucks_b4obmn.svg",
    style: { transition: "width 1s ease" },
  },
  {
    id: 6,
    name: "Dunkin`Donuts",
    img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111633/dunkin-donuts_kiwq2h.svg",
    style: { transition: "width 1s ease" },
  },
] as const satisfies readonly Brand[];

export const MAX_DATASET_SIZE = 10;

export type BrandDatasetValidation =
  | { status: "valid"; brands: readonly Brand[] }
  | { status: "empty" }
  | { status: "invalid"; reason: string };

export function validateBrandDataset(
  brands: readonly Brand[],
): BrandDatasetValidation {
  if (brands.length === 0) return { status: "empty" };
  if (brands.length > MAX_DATASET_SIZE) {
    return {
      status: "invalid",
      reason: "Brand datasets are limited to ten items.",
    };
  }

  const seenIds = new Set<number>();
  for (const brand of brands) {
    if (!Number.isFinite(brand.id)) {
      return { status: "invalid", reason: "Every brand ID must be finite." };
    }
    if (seenIds.has(brand.id)) {
      return { status: "invalid", reason: "Brand IDs must be unique." };
    }
    seenIds.add(brand.id);
    if (brand.name.trim() === "") {
      return {
        status: "invalid",
        reason: "Every brand needs a non-empty name.",
      };
    }
    if (!isHttpsUrl(brand.img)) {
      return {
        status: "invalid",
        reason: "Every brand image must be an HTTPS URL.",
      };
    }
    if (brand.width !== undefined && !Number.isFinite(brand.width)) {
      return { status: "invalid", reason: "Brand width must be finite." };
    }
    if (brand.height !== undefined && !Number.isFinite(brand.height)) {
      return { status: "invalid", reason: "Brand height must be finite." };
    }
    if (brand.className !== undefined && typeof brand.className !== "string") {
      return { status: "invalid", reason: "Brand className must be a string." };
    }
    if (
      brand.style !== undefined &&
      (brand.style === null ||
        Array.isArray(brand.style) ||
        typeof brand.style !== "object" ||
        Object.values(brand.style).some(
          (value) =>
            typeof value !== "string" &&
            (typeof value !== "number" || !Number.isFinite(value)),
        ))
    ) {
      return {
        status: "invalid",
        reason: "Brand style values must be strings or finite numbers.",
      };
    }
  }

  return { status: "valid", brands };
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

const fallbackUrlCache = new Map<string, string>();

export function createBrandFallbackDataUrl(brand: Brand): string {
  const cacheKey = `${brand.id}\u0000${brand.name}`;
  const cached = fallbackUrlCache.get(cacheKey);
  if (cached) return cached;
  const name = escapeXml(brand.name.trim());
  const initials = escapeXml(createInitials(brand.name));
  const accent = stableAccent(brand);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 96"><title>${name}</title><rect width="160" height="96" rx="16" fill="${accent}"/><text x="80" y="58" text-anchor="middle" font-family="sans-serif" font-size="38" fill="white">${initials}</text></svg>`;
  const url = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  fallbackUrlCache.set(cacheKey, url);
  return url;
}

export function materializeFallbackBrands(brands: readonly Brand[]): Brand[] {
  return brands.map((brand) => ({
    ...brand,
    img: createBrandFallbackDataUrl(brand),
  }));
}

function createInitials(name: string): string {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part.match(/[\p{L}\p{N}]/u)?.[0] ?? "")
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return initials || "?";
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function stableAccent(brand: Brand): string {
  const palette = ["#312e81", "#075985", "#166534", "#9a3412", "#86198f"];
  let hash = brand.id;
  for (const character of brand.name)
    hash = (hash * 31 + character.charCodeAt(0)) | 0;
  return palette[Math.abs(hash) % palette.length];
}
