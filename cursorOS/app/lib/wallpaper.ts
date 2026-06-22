import type { ThemeAnalysis } from "./types";

function sanitizeText(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .slice(0, 96);
}

function paletteHex(analysis: ThemeAnalysis, index: number, fallback: string) {
  const value = analysis.palette[index]?.hex;
  return /^#[0-9a-f]{6}$/i.test(value ?? "") ? value : fallback;
}

function hashString(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function motifLayer(motif: string | undefined, c0: string, c1: string, c3: string) {
  switch (motif) {
    case "note":
      return `<g opacity=".82">
  <path d="M1120 186V390C1120 440 1080 474 1028 474C984 474 950 450 950 414C950 378 986 354 1038 354C1069 354 1096 364 1120 382V224L1288 192" fill="none" stroke="${c3}" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="366" cy="642" r="42" fill="${c1}" opacity=".32"/>
  <circle cx="448" cy="590" r="18" fill="${c0}" opacity=".72"/>
</g>`;
    case "armor-core":
      return `<g opacity=".84">
  <path d="M1180 180L1370 290V510L1180 620L990 510V290L1180 180Z" fill="${c0}" opacity=".12" stroke="${c3}" stroke-opacity=".46" stroke-width="5"/>
  <circle cx="1180" cy="400" r="92" fill="${c1}" opacity=".28"/>
  <circle cx="1180" cy="400" r="42" fill="${c3}" opacity=".72"/>
</g>`;
    case "web-arc":
      return `<g fill="none" stroke-linecap="round">
  <path d="M220 714C520 482 888 466 1378 620" stroke="${c0}" stroke-opacity=".36" stroke-width="5"/>
  <path d="M260 596C596 376 940 378 1288 512" stroke="${c1}" stroke-opacity=".28" stroke-width="4"/>
  <path d="M500 348L1130 680M708 280L1200 612M350 564L1010 738" stroke="${c3}" stroke-opacity=".14" stroke-width="3"/>
</g>`;
    case "magic-sparkle":
      return `<g opacity=".9">
  <path d="M1180 136L1232 278L1374 330L1232 382L1180 524L1128 382L986 330L1128 278L1180 136Z" fill="${c3}" opacity=".22"/>
  <path d="M410 492L442 578L528 610L442 642L410 728L378 642L292 610L378 578L410 492Z" fill="${c1}" opacity=".28"/>
  <circle cx="1320" cy="686" r="15" fill="${c0}" opacity=".72"/>
</g>`;
    case "mech-panel":
      return `<g opacity=".82">
  <rect x="930" y="150" width="430" height="250" rx="18" fill="${c0}" opacity=".1" stroke="${c3}" stroke-opacity=".42" stroke-width="4"/>
  <rect x="1010" y="476" width="330" height="160" rx="12" fill="${c1}" opacity=".12" stroke="${c0}" stroke-opacity=".38" stroke-width="3"/>
  <path d="M980 226H1296M980 294H1208M1060 548H1280M830 700H1420" stroke="${c3}" stroke-opacity=".34" stroke-width="5" stroke-linecap="round"/>
</g>`;
    case "slash":
      return `<g fill="none" stroke-linecap="round">
  <path d="M1130 104L690 790" stroke="${c0}" stroke-opacity=".34" stroke-width="18"/>
  <path d="M1310 188L910 806" stroke="${c1}" stroke-opacity=".28" stroke-width="12"/>
  <path d="M960 96L560 702" stroke="${c3}" stroke-opacity=".18" stroke-width="9"/>
</g>`;
    default:
      return `<g opacity=".8">
  <circle cx="1180" cy="330" r="150" fill="${c0}" opacity=".14"/>
  <circle cx="1238" cy="388" r="62" fill="${c1}" opacity=".3"/>
  <circle cx="1140" cy="518" r="26" fill="${c3}" opacity=".62"/>
</g>`;
  }
}

function shapeLayer(shapePreset: string | undefined, c0: string, c1: string, c3: string) {
  switch (shapePreset) {
    case "pixel-cursor":
      return `<g opacity=".76">
  <rect x="162" y="522" width="74" height="74" fill="${c0}" opacity=".18"/>
  <rect x="236" y="596" width="74" height="74" fill="${c1}" opacity=".16"/>
  <rect x="310" y="670" width="74" height="74" fill="${c3}" opacity=".2"/>
</g>`;
    case "halo-ring":
      return `<g fill="none">
  <circle cx="322" cy="638" r="132" stroke="${c0}" stroke-opacity=".28" stroke-width="8"/>
  <circle cx="322" cy="638" r="68" stroke="${c1}" stroke-opacity=".32" stroke-width="5"/>
</g>`;
    case "weapon-pointer":
      return `<path d="M188 718L504 500L390 724L706 620" fill="none" stroke="${c3}" stroke-opacity=".24" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;
    case "soft-blob":
      return `<path d="M126 626C238 492 402 528 500 642C596 754 748 752 858 660C790 810 558 844 354 802C210 772 110 734 126 626Z" fill="${c1}" opacity=".12"/>`;
    case "slim-pointer":
      return `<path d="M188 770L428 438L512 736" fill="none" stroke="${c0}" stroke-opacity=".3" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
    default:
      return `<path d="M130 730C350 548 530 584 700 704C850 810 1040 816 1260 710" fill="none" stroke="${c1}" stroke-opacity=".34" stroke-width="4"/>`;
  }
}

export function createFallbackWallpaperDataUrl(analysis: ThemeAnalysis) {
  const c0 = paletteHex(analysis, 0, "#27f2ff");
  const c1 = paletteHex(analysis, 1, "#ff3bd5");
  const c2 = paletteHex(analysis, 2, "#05070d");
  const c3 = paletteHex(analysis, 3, "#d8ff4f");
  const title = sanitizeText(analysis.title || "CursorOS");
  const mood = sanitizeText(analysis.mood || "AI desktop theme");
  const seed = hashString(`${analysis.title}|${analysis.cursorStyle.variant}|${analysis.wallpaperPrompt}`);
  const gridSize = 64 + (seed % 4) * 12;
  const orbX = 18 + (seed % 22);
  const orbY = 14 + ((seed >> 4) % 18);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <title>${title}</title>
  <desc>${mood}</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c2}"/>
      <stop offset=".52" stop-color="#070a12"/>
      <stop offset="1" stop-color="#101827"/>
    </linearGradient>
    <radialGradient id="a" cx="${orbX}%" cy="${orbY}%" r="50%">
      <stop offset="0" stop-color="${c0}" stop-opacity=".44"/>
      <stop offset=".62" stop-color="${c0}" stop-opacity=".08"/>
      <stop offset="1" stop-color="${c0}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="b" cx="82%" cy="28%" r="48%">
      <stop offset="0" stop-color="${c1}" stop-opacity=".36"/>
      <stop offset=".68" stop-color="${c1}" stop-opacity=".06"/>
      <stop offset="1" stop-color="${c1}" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur">
      <feGaussianBlur stdDeviation="28"/>
    </filter>
    <pattern id="grid" width="${gridSize}" height="${gridSize}" patternUnits="userSpaceOnUse">
      <path d="M${gridSize} 0H0V${gridSize}" fill="none" stroke="${c0}" stroke-opacity=".075" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  <rect width="1600" height="900" fill="url(#grid)"/>
  <rect width="1600" height="900" fill="url(#a)"/>
  <rect width="1600" height="900" fill="url(#b)"/>
  <path d="M1028 118C1260 88 1460 238 1508 418C1550 580 1450 744 1268 794C1082 846 902 766 860 620C810 444 846 146 1028 118Z" fill="${c0}" opacity=".16" filter="url(#blur)"/>
  ${motifLayer(analysis.cursorStyle.motif, c0, c1, c3)}
  ${shapeLayer(analysis.cursorStyle.shapePreset, c0, c1, c3)}
  <g opacity=".78">
    <rect x="94" y="110" width="430" height="134" rx="22" fill="#020617" fill-opacity=".24" stroke="${c0}" stroke-opacity=".2"/>
    <rect x="112" y="130" width="180" height="14" rx="7" fill="${c0}" opacity=".42"/>
    <rect x="112" y="166" width="330" height="10" rx="5" fill="#f8fafc" opacity=".18"/>
    <rect x="112" y="194" width="246" height="10" rx="5" fill="${c1}" opacity=".28"/>
  </g>
  <circle cx="1310" cy="656" r="72" fill="${c3}" opacity=".15"/>
  <circle cx="1310" cy="656" r="38" fill="${c0}" opacity=".66"/>
</svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
