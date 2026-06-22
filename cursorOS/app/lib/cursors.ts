import type { CursorAsset, PaletteColor, ThemeAnalysis } from "./types";

const FALLBACK_COLORS = ["#27f2ff", "#ff3bd5", "#d8ff4f", "#f8fafc"];

function normalizeHex(value: string | undefined, fallback: string) {
  if (!value) return fallback;
  const trimmed = value.trim();
  return /^#[0-9a-f]{6}$/i.test(trimmed) ? trimmed : fallback;
}

function colorAt(palette: PaletteColor[], index: number) {
  return normalizeHex(palette[index]?.hex, FALLBACK_COLORS[index % FALLBACK_COLORS.length]);
}

function hexToRgb(hex: string) {
  return {
    r: Number.parseInt(hex.slice(1, 3), 16),
    g: Number.parseInt(hex.slice(3, 5), 16),
    b: Number.parseInt(hex.slice(5, 7), 16)
  };
}

function luminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function saturationScore(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return Math.max(r, g, b) - Math.min(r, g, b);
}

function orderedCursorColors(palette: PaletteColor[]) {
  const colors = [0, 1, 2, 3].map((index) => colorAt(palette, index));
  const vivid = colors
    .filter((color) => luminance(color) > 55 && saturationScore(color) > 24)
    .sort((a, b) => saturationScore(b) + luminance(b) * 0.2 - (saturationScore(a) + luminance(a) * 0.2));
  const light = colors.find((color) => luminance(color) > 160) ?? "#f8fafc";
  const dark = colors.find((color) => luminance(color) < 42) ?? "#05070d";

  return [
    vivid[0] ?? colors[0] ?? FALLBACK_COLORS[0],
    vivid[1] ?? colors[1] ?? FALLBACK_COLORS[1],
    dark,
    light
  ];
}

function svgShell(id: string, body: string, size = 64) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64" fill="none">
  <defs>
    <filter id="glow-${id}" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="2.8" result="blur"/>
      <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.12 0 0 0 0 0.95 0 0 0 0 1 0 0 0 .72 0"/>
      <feBlend in2="SourceGraphic" mode="screen"/>
    </filter>
    <linearGradient id="grad-${id}" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="var(--c0)"/>
      <stop offset="54%" stop-color="var(--c1)"/>
      <stop offset="100%" stop-color="var(--c2)"/>
    </linearGradient>
  </defs>
  ${body}
</svg>`;
}

function applyColors(svg: string, colors: string[]) {
  return svg
    .replaceAll("var(--c0)", colors[0])
    .replaceAll("var(--c1)", colors[1])
    .replaceAll("var(--c2)", colors[2])
    .replaceAll("var(--c3)", colors[3]);
}

function hashString(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function motifMark(motif: string | undefined) {
  switch (motif) {
    case "armor-sitter":
      return `<g>
  <circle cx="45" cy="17" r="6" fill="var(--c1)" stroke="var(--c3)" stroke-width="1.8"/>
  <path d="M40 16H50L48 20H42L40 16Z" fill="#05070d" stroke="var(--c3)" stroke-width="1.2"/>
  <path d="M39 25L45 21L51 25L50 36H40L39 25Z" fill="var(--c1)" stroke="var(--c3)" stroke-width="1.8" stroke-linejoin="round"/>
  <circle cx="45" cy="29" r="3" fill="var(--c0)" stroke="var(--c3)" stroke-width="1"/>
  <path d="M40 35L34 43M50 35L57 43M39 27L32 31M51 27L58 31" stroke="var(--c3)" stroke-width="2" stroke-linecap="round"/>
  <circle cx="58" cy="31" r="3" fill="var(--c0)"/>
</g>`;
    case "armor-helmet":
      return `<g>
  <path d="M35 16L45 10L56 16V30C56 39 51 47 45 50C39 47 35 39 35 30V16Z" fill="var(--c1)" stroke="var(--c3)" stroke-width="2" stroke-linejoin="round"/>
  <path d="M39 20H52L49 31H42L39 20Z" fill="#05070d" stroke="var(--c3)" stroke-width="1.7" stroke-linejoin="round"/>
  <path d="M39 34L45 38L51 34M37 18L32 25M54 18L59 25" stroke="var(--c0)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="45" cy="31" r="3.7" fill="var(--c0)" stroke="var(--c3)" stroke-width="1.4"/>
  <circle cx="57" cy="42" r="3.4" fill="var(--c0)"/>
</g>`;
    case "prompt-glyph":
      return `<path d="M35 18C42 12 53 14 57 22C51 24 47 29 45 36C39 34 35 28 35 18Z" fill="var(--c1)" opacity=".72" stroke="var(--c3)" stroke-width="1.8"/>
  <path d="M39 22H53M41 28H50M44 34H47" stroke="var(--c3)" stroke-width="1.8" stroke-linecap="round"/>`;
    case "vocal-twintail":
      return `<path d="M45 12C36 20 36 33 44 45M53 15C44 23 44 37 55 48" stroke="var(--c0)" stroke-width="3" stroke-linecap="round"/>
  <path d="M35 15C43 22 44 31 38 42" stroke="var(--c1)" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M24 16V31C24 35 21 38 17 38C14 38 12 36 12 33C12 30 15 28 19 28C21 28 23 29 24 30V18L33 16" stroke="var(--c3)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
    case "cat-ear":
      return `<path d="M38 18L45 7L52 19" fill="#05070d" stroke="var(--c3)" stroke-width="2.2" stroke-linejoin="round"/>
  <path d="M43 38C45 41 49 41 51 38M44 32H44.2M51 32H51.2" stroke="var(--c1)" stroke-width="2.4" stroke-linecap="round"/>`;
    case "heart":
      return `<path d="M45 20C42 15 34 17 34 24C34 31 45 37 45 37C45 37 56 31 56 24C56 17 48 15 45 20Z" fill="var(--c1)" stroke="var(--c3)" stroke-width="1.6"/>`;
    case "flame":
      return `<path d="M45 11C51 19 39 23 50 34C54 38 53 47 45 51C36 47 35 39 40 33C44 28 42 24 42 20C39 25 36 28 35 34C32 25 37 17 45 11Z" fill="var(--c1)" stroke="var(--c3)" stroke-width="1.8" stroke-linejoin="round"/>`;
    case "ice":
      return `<path d="M45 12V40M34 18L56 34M56 18L34 34M39 12L45 18L51 12M39 40L45 34L51 40" stroke="var(--c3)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
    case "flower":
      return `<g fill="var(--c1)" stroke="var(--c3)" stroke-width="1.2">
    <ellipse cx="45" cy="19" rx="4" ry="8"/>
    <ellipse cx="45" cy="35" rx="4" ry="8"/>
    <ellipse cx="37" cy="27" rx="8" ry="4"/>
    <ellipse cx="53" cy="27" rx="8" ry="4"/>
    <circle cx="45" cy="27" r="3" fill="var(--c3)"/>
  </g>`;
    case "butterfly":
      return `<path d="M44 27C35 14 24 19 31 31C24 44 36 48 44 33" fill="var(--c1)" opacity=".8"/>
  <path d="M46 27C55 14 66 19 59 31C66 44 54 48 46 33" fill="var(--c0)" opacity=".8"/>
  <path d="M45 20V43" stroke="var(--c3)" stroke-width="2" stroke-linecap="round"/>`;
    case "crown":
      return `<path d="M34 35L37 19L45 30L53 19L56 35H34Z" fill="var(--c1)" stroke="var(--c3)" stroke-width="2" stroke-linejoin="round"/>
  <circle cx="37" cy="19" r="2" fill="var(--c3)"/>
  <circle cx="53" cy="19" r="2" fill="var(--c3)"/>`;
    case "pixel-spark":
      return `<path d="M36 14H44V22H36V14ZM48 22H56V30H48V22ZM40 34H48V42H40V34ZM28 26H36V34H28V26Z" fill="var(--c3)"/>
  <path d="M36 14H44V22H36V14ZM48 22H56V30H48V22ZM40 34H48V42H40V34Z" stroke="var(--c1)" stroke-width="1"/>`;
    case "code-bracket":
      return `<path d="M40 18L32 26L40 34M51 18L59 26L51 34M48 14L43 38" stroke="var(--c3)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`;
    case "note":
      return `<path d="M44 15V31C44 35 41 38 37 38C34 38 31 36 31 33C31 30 34 28 38 28C40 28 42 29 44 30V18L53 16" stroke="var(--c3)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="26" cy="18" r="2.4" fill="var(--c1)"/>`;
    case "armor-core":
      return `<path d="M44 15L53 20V31L44 36L35 31V20L44 15Z" fill="#05070d" stroke="var(--c3)" stroke-width="2"/>
  <circle cx="44" cy="25.5" r="4.2" fill="var(--c1)"/>`;
    case "web-arc":
      return `<path d="M35 17C44 16 51 20 55 28M32 25C41 24 48 29 51 37M39 18L49 36" stroke="var(--c3)" stroke-width="1.8" stroke-linecap="round"/>`;
    case "magic-sparkle":
      return `<path d="M45 13L48 21L56 24L48 27L45 35L42 27L34 24L42 21L45 13Z" fill="var(--c3)"/>
  <path d="M27 17L29 22L34 24L29 26L27 31L25 26L20 24L25 22L27 17Z" fill="var(--c1)"/>`;
    case "mech-panel":
      return `<path d="M35 15H52V30H35Z" fill="#05070d" stroke="var(--c3)" stroke-width="2"/>
  <path d="M39 20H48M39 25H45M52 22H57" stroke="var(--c1)" stroke-width="1.8" stroke-linecap="round"/>`;
    case "slash":
      return `<path d="M52 13L35 35M57 22L44 39M45 12L32 28" stroke="var(--c3)" stroke-width="3" stroke-linecap="round"/>
  <path d="M55 13L38 35" stroke="var(--c1)" stroke-width="1.2" stroke-linecap="round"/>`;
    default:
      return `<circle cx="46" cy="24" r="5" fill="var(--c3)"/>
  <circle cx="46" cy="24" r="2" fill="var(--c1)"/>`;
  }
}

function trailMarks(seed: number) {
  switch (seed % 3) {
    case 0:
      return `<path d="M9 42C16 39 22 39 29 42" stroke="var(--c1)" stroke-width="2" stroke-linecap="round" opacity=".82"/>
  <circle cx="12" cy="48" r="2.5" fill="var(--c3)" opacity=".9"/>`;
    case 1:
      return `<path d="M8 24H18M11 32H24M14 40H29" stroke="var(--c1)" stroke-width="2.2" stroke-linecap="round" opacity=".78"/>`;
    default:
      return `<circle cx="12" cy="25" r="2" fill="var(--c1)" opacity=".86"/>
  <circle cx="18" cy="35" r="1.8" fill="var(--c3)" opacity=".86"/>
  <circle cx="10" cy="45" r="1.5" fill="var(--c0)" opacity=".86"/>`;
  }
}

function pointerBody(shapePreset: string | undefined, strokeWidth: number, glowOpacity: number, motif: string | undefined, seed: number) {
  const motifSvg = motifMark(motif);
  const trailSvg = trailMarks(seed);

  switch (shapePreset) {
    case "soft-blob":
      return `<path filter="url(#glow-pointer)" opacity="${glowOpacity}" d="M17 8C30 14 47 24 55 36C48 38 41 40 36 45C31 50 29 56 24 59C20 44 16 25 17 8Z" fill="url(#grad-pointer)"/>
  <path d="M17 8C30 14 47 24 55 36C48 38 41 40 36 45C31 50 29 56 24 59C20 44 16 25 17 8Z" fill="#05070d" stroke="url(#grad-pointer)" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
  <path d="M29 32C35 35 39 40 41 47" stroke="var(--c3)" stroke-width="2.8" stroke-linecap="round"/>
  ${motifSvg}
  ${trailSvg}`;
    case "slim-pointer":
      return `<path filter="url(#glow-pointer)" opacity="${glowOpacity}" d="M19 5L50 53L35 48L26 60L19 5Z" fill="url(#grad-pointer)"/>
  <path d="M19 5L50 53L35 48L26 60L19 5Z" fill="#05070d" stroke="url(#grad-pointer)" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
  <path d="M29 27L37 51" stroke="var(--c3)" stroke-width="2.6" stroke-linecap="round"/>
  ${motifSvg}
  ${trailSvg}`;
    case "pixel-cursor":
      return `<path filter="url(#glow-pointer)" opacity="${glowOpacity}" d="M12 6H24V16H34V26H48V38H37V48H31V58H22V42H12V6Z" fill="url(#grad-pointer)"/>
  <path d="M12 6H24V16H34V26H48V38H37V48H31V58H22V42H12V6Z" fill="#05070d" stroke="url(#grad-pointer)" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
  <path d="M24 18H32V27H40" stroke="var(--c3)" stroke-width="3" stroke-linecap="square"/>
  ${motifSvg}
  ${trailSvg}`;
    case "halo-ring":
      return `<circle filter="url(#glow-pointer)" opacity="${glowOpacity}" cx="31" cy="28" r="20" fill="url(#grad-pointer)"/>
  <circle cx="31" cy="28" r="17" fill="#05070d" stroke="url(#grad-pointer)" stroke-width="${strokeWidth}"/>
  <path d="M39 43L48 59" stroke="url(#grad-pointer)" stroke-width="8" stroke-linecap="round"/>
  <path d="M39 43L48 59" stroke="#05070d" stroke-width="3" stroke-linecap="round"/>
  <circle cx="31" cy="28" r="6" fill="var(--c3)"/>
  ${motifSvg}
  ${trailSvg}`;
    case "weapon-pointer":
      return `<path filter="url(#glow-pointer)" opacity="${glowOpacity}" d="M30 4L56 20L40 28L51 43L36 39L25 60L17 35L7 24L24 18L30 4Z" fill="url(#grad-pointer)"/>
  <path d="M30 4L56 20L40 28L51 43L36 39L25 60L17 35L7 24L24 18L30 4Z" fill="#05070d" stroke="url(#grad-pointer)" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
  <path d="M29 16L32 33L41 41" stroke="var(--c3)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
  ${motifSvg}
  ${trailSvg}`;
    default:
      return `<path filter="url(#glow-pointer)" opacity="${glowOpacity}" d="M13 7L51 35L34 38L26 56L13 7Z" fill="url(#grad-pointer)"/>
  <path d="M13 7L51 35L34 38L26 56L13 7Z" fill="#05070d" stroke="url(#grad-pointer)" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
  <path d="M27 31L36 51" stroke="var(--c3)" stroke-width="3" stroke-linecap="round"/>
  ${motifSvg}
  ${trailSvg}`;
  }
}

function precisionBody(shapePreset: string | undefined, glowOpacity: number, motif: string | undefined) {
  if (shapePreset === "pixel-cursor") {
    return `<path filter="url(#glow-precision)" opacity="${glowOpacity}" d="M18 18H46V46H18V18Z" stroke="url(#grad-precision)" stroke-width="8"/>
  <path d="M18 18H46V46H18V18Z" stroke="#05070d" stroke-width="3"/>
  <path d="M32 10V24M32 40V54M10 32H24M40 32H54" stroke="url(#grad-precision)" stroke-width="3" stroke-linecap="square"/>
  ${motifMark(motif)}`;
  }

  return `<circle filter="url(#glow-precision)" opacity="${glowOpacity}" cx="32" cy="32" r="${shapePreset === "halo-ring" ? 20 : 17}" stroke="url(#grad-precision)" stroke-width="7"/>
  <circle cx="32" cy="32" r="${shapePreset === "halo-ring" ? 12 : 17}" stroke="#05070d" stroke-width="3"/>
  <path d="M32 10V22M32 42V54M10 32H22M42 32H54" stroke="url(#grad-precision)" stroke-width="3" stroke-linecap="round"/>
  <circle cx="32" cy="32" r="3" fill="var(--c3)"/>
  ${motifMark(motif)}`;
}

export function createCursorAssets(analysis: ThemeAnalysis): CursorAsset[] {
  const colors = orderedCursorColors(analysis.palette);
  const strokeWidth = analysis.cursorStyle.density === "detailed" ? 2.4 : 2.8;
  const glowOpacity = analysis.cursorStyle.glow === "strong" ? 0.9 : 0.54;
  const motif = analysis.cursorStyle.motif;
  const shapePreset = analysis.cursorStyle.shapePreset;
  const seed = hashString(`${analysis.title}|${analysis.cursorStyle.variant}|${analysis.wallpaperPrompt}`);

  const assets: CursorAsset[] = [
    {
      id: "pointer",
      name: "Pointer",
      role: "Default select",
      svg: svgShell("pointer", pointerBody(shapePreset, strokeWidth, glowOpacity, motif, seed))
    },
    {
      id: "text",
      name: "Text Beam",
      role: "Text input",
      svg: svgShell(
        "text",
        `<path filter="url(#glow-text)" opacity="${glowOpacity}" d="M24 10H40M24 54H40M32 11V53" stroke="url(#grad-text)" stroke-width="7" stroke-linecap="round"/>
  <path d="M23 10H41M23 54H41M32 11V53" stroke="#f8fafc" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M28 18H36M28 46H36" stroke="var(--c1)" stroke-width="2" stroke-linecap="round"/>
  ${motifMark(motif)}`
      )
    },
    {
      id: "link",
      name: "Link Hand",
      role: "Clickable target",
      svg: svgShell(
        "link",
        `<path filter="url(#glow-link)" opacity="${glowOpacity}" d="M21 29V17a5 5 0 0110 0v9h2v-5a5 5 0 0110 0v7h1a5 5 0 015 5v8c0 10-7 17-18 17h-2c-8 0-14-5-17-12l-4-10a5 5 0 019-4l4 7V29z" fill="url(#grad-link)"/>
  <path d="M21 29V17a5 5 0 0110 0v9h2v-5a5 5 0 0110 0v7h1a5 5 0 015 5v8c0 10-7 17-18 17h-2c-8 0-14-5-17-12l-4-10a5 5 0 019-4l4 7V29z" fill="#080b12" stroke="url(#grad-link)" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M31 27V39M42 29V39" stroke="var(--c3)" stroke-width="2.2" stroke-linecap="round"/>
  ${motifMark(motif)}`
      )
    },
    {
      id: "resize",
      name: "Resize",
      role: "Scale handles",
      svg: svgShell(
        "resize",
        `<path filter="url(#glow-resize)" opacity="${glowOpacity}" d="M16 48L48 16M31 16H48V33M16 31V48H33" stroke="url(#grad-resize)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16 48L48 16M31 16H48V33M16 31V48H33" stroke="#05070d" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16 48L48 16M31 16H48V33M16 31V48H33" stroke="url(#grad-resize)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  ${shapePreset === "pixel-cursor" ? `<path d="M8 52H22V56H8V52ZM42 8H56V12H42V8Z" fill="var(--c3)"/>` : motifMark(motif)}`
      )
    },
    {
      id: "precision",
      name: "Precision",
      role: "Fine select",
      svg: svgShell("precision", precisionBody(shapePreset, glowOpacity, motif))
    },
    {
      id: "busy",
      name: "Busy",
      role: "Loading state",
      svg: svgShell(
        "busy",
        `<circle filter="url(#glow-busy)" opacity="${glowOpacity}" cx="32" cy="32" r="21" stroke="url(#grad-busy)" stroke-width="8" stroke-dasharray="76 56" stroke-linecap="round"/>
  <circle cx="32" cy="32" r="13" fill="#05070d" stroke="var(--c3)" stroke-width="2"/>
  <path d="M32 19V32L41 37" stroke="url(#grad-busy)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  ${motifMark(motif)}
  ${trailMarks(seed + 1)}`
      )
    }
  ];

  return assets.map((asset) => ({
    ...asset,
    svg: applyColors(asset.svg, colors)
  }));
}

export function createCssSnippet(analysis: ThemeAnalysis) {
  const pointer = encodeURIComponent(createCursorAssets(analysis)[0].svg);
  const accent = orderedCursorColors(analysis.palette)[0];
  return `:root {
  --cursoros-accent: ${accent};
}

body {
  cursor: url("data:image/svg+xml,${pointer}") 8 8, auto;
}

a, button, [role="button"] {
  cursor: pointer;
}`;
}
