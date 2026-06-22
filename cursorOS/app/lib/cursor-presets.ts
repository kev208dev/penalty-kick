import type { GenerateRequest, PaletteColor, ThemeAnalysis } from "./types";

export type CursorConcept = {
  id: string;
  name: string;
  label: string;
  motif: "note" | "armor-core" | "web-arc" | "magic-sparkle" | "mech-panel" | "slash";
  description: string;
  palette: string[];
  defaultShape: string;
  promptSeed: string;
};

export type ColorMood = {
  id: string;
  name: string;
  label: string;
  colors: string[];
  description: string;
};

export type ShapePreset = {
  id: string;
  name: string;
  label: string;
  description: string;
};

export const cursorConcepts: CursorConcept[] = [
  {
    id: "virtual-idol",
    name: "Virtual Idol",
    label: "보컬/네온",
    motif: "note",
    description: "Bright stage glow, musical notes, playful digital energy.",
    palette: ["#00f5ff", "#ff4fd8", "#080b18", "#f8fafc"],
    defaultShape: "slim-pointer",
    promptSeed: "virtual idol inspired cursor pack, musical note motif, luminous stage cyan and pink"
  },
  {
    id: "armored-hero",
    name: "Armored Hero",
    label: "아머/코어",
    motif: "armor-core",
    description: "Metal panels, reactor glow, heroic red-gold energy.",
    palette: ["#ff2e2e", "#ffd166", "#111827", "#f8fafc"],
    defaultShape: "weapon-pointer",
    promptSeed: "armored hero cursor pack, reactor core motif, red gold metal interface"
  },
  {
    id: "web-acrobat",
    name: "Web Acrobat",
    label: "웹/스윙",
    motif: "web-arc",
    description: "Elastic web arcs, agile movement, blue-red contrast.",
    palette: ["#ff315a", "#1d7cff", "#070812", "#f8fafc"],
    defaultShape: "sharp-arrow",
    promptSeed: "web acrobat cursor pack, web arc motif, agile red blue comic energy"
  },
  {
    id: "magical-guardian",
    name: "Magical Guardian",
    label: "매직/별빛",
    motif: "magic-sparkle",
    description: "Sparkles, soft halos, dreamy transformation UI.",
    palette: ["#ff75d8", "#9d7cff", "#101014", "#fef3ff"],
    defaultShape: "halo-ring",
    promptSeed: "magical guardian cursor pack, sparkle motif, soft pink violet glow"
  },
  {
    id: "retro-mecha",
    name: "Retro Mecha",
    label: "메카/패널",
    motif: "mech-panel",
    description: "Angular panels, amber readouts, industrial sci-fi.",
    palette: ["#ffb020", "#34d399", "#111111", "#e5e7eb"],
    defaultShape: "pixel-cursor",
    promptSeed: "retro mecha cursor pack, mechanical panel motif, amber green monitor glow"
  },
  {
    id: "cyber-ninja",
    name: "Cyber Ninja",
    label: "닌자/슬래시",
    motif: "slash",
    description: "Fast slashes, stealth black, electric blue edges.",
    palette: ["#00e5ff", "#7c3cff", "#030712", "#f8fafc"],
    defaultShape: "weapon-pointer",
    promptSeed: "cyber ninja cursor pack, slash motif, stealth dark interface with electric edges"
  }
];

export const colorMoods: ColorMood[] = [
  {
    id: "neon-cyan",
    name: "Neon Cyan",
    label: "사이버",
    colors: ["#00f5ff", "#7c3cff", "#05070d", "#e6ff4f"],
    description: "Cyan-dominant glow with a cyberpunk edge."
  },
  {
    id: "cherry-pink",
    name: "Cherry Pink",
    label: "팝",
    colors: ["#ff3bd5", "#ff6f91", "#120714", "#fdf4ff"],
    description: "Bright pink, cute pop energy, soft highlights."
  },
  {
    id: "iron-red",
    name: "Iron Red",
    label: "히어로",
    colors: ["#ff2e2e", "#ffd166", "#130808", "#fff7ed"],
    description: "Red-gold metal contrast with heroic intensity."
  },
  {
    id: "electric-blue",
    name: "Electric Blue",
    label: "스피드",
    colors: ["#1d7cff", "#00f5ff", "#060b18", "#f8fafc"],
    description: "Blue electric trails and crisp high contrast."
  },
  {
    id: "mono-white",
    name: "Mono White",
    label: "미니멀",
    colors: ["#f8fafc", "#94a3b8", "#05070d", "#38bdf8"],
    description: "Clean monochrome cursor with a single cool accent."
  },
  {
    id: "custom-solid",
    name: "Custom Solid",
    label: "단색",
    colors: ["#00f5ff", "#f8fafc", "#05070d", "#7c3cff"],
    description: "A single user-selected accent color."
  }
];

export const shapePresets: ShapePreset[] = [
  {
    id: "sharp-arrow",
    name: "Sharp Arrow",
    label: "기본 포인터",
    description: "Classic arrow with crisp neon edges."
  },
  {
    id: "soft-blob",
    name: "Soft Blob",
    label: "둥근 젤리",
    description: "Rounded, friendly, squishy pointer silhouette."
  },
  {
    id: "slim-pointer",
    name: "Slim Pointer",
    label: "얇고 세련됨",
    description: "Long tapered pointer for idol and productivity themes."
  },
  {
    id: "pixel-cursor",
    name: "Pixel Cursor",
    label: "레트로",
    description: "Blocky pixel cursor with chunky corners."
  },
  {
    id: "halo-ring",
    name: "Halo Ring",
    label: "원형 오라",
    description: "Ring-like pointer built around a glowing focus halo."
  },
  {
    id: "weapon-pointer",
    name: "Weapon-like Pointer",
    label: "샤프/무기형",
    description: "Blade-like pointer with aggressive directionality."
  }
];

const themeDefaults: Record<
  string,
  { cursorConcept: string; colorMood: string; shapePreset: string }
> = {
  "neon-dev": {
    cursorConcept: "cyber-ninja",
    colorMood: "neon-cyan",
    shapePreset: "sharp-arrow"
  },
  "arc-minimal": {
    cursorConcept: "magical-guardian",
    colorMood: "mono-white",
    shapePreset: "halo-ring"
  },
  "synth-gamer": {
    cursorConcept: "retro-mecha",
    colorMood: "electric-blue",
    shapePreset: "weapon-pointer"
  },
  "studio-aura": {
    cursorConcept: "virtual-idol",
    colorMood: "cherry-pink",
    shapePreset: "slim-pointer"
  }
};

const variantWords = [
  "Flux Edge",
  "Signal Bloom",
  "Glass Trace",
  "Pulse Vector",
  "Prism Trail",
  "Night Circuit",
  "Orbit Mark",
  "Chrome Spark"
];

const wallpaperScenes = [
  "layered glass panels over a wide desktop surface",
  "floating app windows with clean negative space for icons",
  "diagonal light trails framing the cursor motion",
  "deep workspace horizon with luminous panel reflections",
  "abstract OS chrome with soft depth and crisp focus zones",
  "kinetic input trails across a polished monitor-like field"
];

const cursorBehaviors = [
  "split-color edge highlights",
  "tiny motif marks on the pointer shell",
  "offset glow trails behind click targets",
  "crisp inner cutouts and high-contrast hotspots",
  "layered bevels with a bright active edge",
  "compact animated-state glyph language"
];

type PromptDesign = {
  subject?: string;
  motif?: string;
  shapePreset?: string;
  accentName?: string;
  palette?: PaletteColor[];
  behavior?: string;
  scene?: string;
  elements: string[];
};

const promptColorPalettes: Array<{
  patterns: RegExp[];
  name: string;
  colors: string[];
}> = [
  {
    patterns: [/miku|vocaloid|vocal\s*synth|teal|mint|청록|민트/i],
    name: "Teal Vocal",
    colors: ["#39f5d7", "#00a7c8", "#07141a", "#f5ffff"]
  },
  {
    patterns: [/pink|rose|heart|cherry|sakura|핑크|벚꽃/i],
    name: "Cherry Pink",
    colors: ["#ff4fb8", "#ff9bd5", "#160713", "#fff1fb"]
  },
  {
    patterns: [/purple|violet|lavender|보라|라벤더/i],
    name: "Violet Glow",
    colors: ["#9d7cff", "#ff75d8", "#10091c", "#f6efff"]
  },
  {
    patterns: [/iron\s*man|ironman|arc\s*reactor|repulsor|armor|armour|red|flame|fire|lava|dragon|아이언맨|아크\s*리액터|리펄서|아머|빨강|불|화염/i],
    name: "Flame Red",
    colors: ["#ff3b30", "#ffb020", "#180707", "#fff1df"]
  },
  {
    patterns: [/blue|ice|snow|water|ocean|파랑|얼음|눈/i],
    name: "Ice Blue",
    colors: ["#55ccff", "#b8f3ff", "#06121d", "#f2fbff"]
  },
  {
    patterns: [/green|forest|matrix|초록|숲/i],
    name: "Matrix Green",
    colors: ["#34d399", "#d8ff4f", "#06140d", "#effff7"]
  },
  {
    patterns: [/gold|yellow|sun|crown|금|노랑|왕관/i],
    name: "Gold Signal",
    colors: ["#ffd166", "#ff8a00", "#151007", "#fff7df"]
  },
  {
    patterns: [/mono|white|black|minimal|흰색|검정|미니멀/i],
    name: "Mono Focus",
    colors: ["#f8fafc", "#94a3b8", "#05070d", "#38bdf8"]
  }
];

const promptRules: Array<{
  patterns: RegExp[];
  subject: string;
  motif: string;
  shapePreset?: string;
  behavior: string;
  scene: string;
  elements: string[];
}> = [
  {
    patterns: [/(?=.*(?:iron\s*man|ironman|arc\s*reactor|repulsor|아이언맨|아크\s*리액터|리펄서))(?=.*(?:sit|sitting|perch|on\s+cursor|앉|위에))/i],
    subject: "Perched Armored Hero",
    motif: "armor-sitter",
    shapePreset: "weapon-pointer",
    behavior: "a tiny red-gold armored hero perched on the cursor shoulder, with arc-reactor chest glow and repulsor hand light",
    scene: "red-gold armored hero desktop with a tiny perched armored figure and arc-reactor glow",
    elements: ["perched armored figure", "helmet", "arc reactor", "repulsor hand"]
  },
  {
    patterns: [/iron\s*man|ironman|arc\s*reactor|repulsor|아이언맨|아크\s*리액터|리펄서/i],
    subject: "Red Gold Armored Hero",
    motif: "armor-helmet",
    shapePreset: "weapon-pointer",
    behavior: "red-gold armor plating, helmet faceplate fins, arc-reactor core, and repulsor glow mounted on the cursor body",
    scene: "red-gold armored hero desktop with arc-reactor glow and repulsor light trails",
    elements: ["helmet faceplate", "arc reactor", "repulsor glow", "armor plating"]
  },
  {
    patterns: [/miku|hatsune|vocaloid|vocal\s*synth|보컬로이드|미쿠/i],
    subject: "Teal Vocal Synth",
    motif: "vocal-twintail",
    shapePreset: "slim-pointer",
    behavior: "teal twin-tail ribbons, music-note cutouts, and stage-light trails",
    scene: "teal vocal-synth stage glow with ribbon-like sound trails",
    elements: ["twin-tail ribbons", "music notes", "stage glow"]
  },
  {
    patterns: [/cat|kitty|neko|고양이|냥/i],
    subject: "Cat Ear",
    motif: "cat-ear",
    shapePreset: "soft-blob",
    behavior: "cat-ear corners, paw-dot click marks, and soft rounded glow",
    scene: "soft cat-ear desktop accents with playful paw shaped light marks",
    elements: ["cat ears", "paw dots"]
  },
  {
    patterns: [/heart|love|romance|하트|사랑/i],
    subject: "Heart Pulse",
    motif: "heart",
    shapePreset: "soft-blob",
    behavior: "heart-shaped hotspots and soft pulse highlights",
    scene: "heart pulse glow with soft romantic interface reflections",
    elements: ["heart", "pulse"]
  },
  {
    patterns: [/flame|fire|burn|dragon|불|화염|용/i],
    subject: "Flame Edge",
    motif: "flame",
    shapePreset: "weapon-pointer",
    behavior: "flame fins, hot-core outlines, and ember trail dots",
    scene: "ember-lit desktop with flame edge cursor trails",
    elements: ["flame", "embers"]
  },
  {
    patterns: [/ice|snow|frost|얼음|눈|서리/i],
    subject: "Frost Prism",
    motif: "ice",
    shapePreset: "halo-ring",
    behavior: "snowflake nodes, icy prism facets, and cool crystalline edges",
    scene: "frosted glass desktop with crystalline blue highlights",
    elements: ["snowflake", "ice facets"]
  },
  {
    patterns: [/flower|sakura|cherry blossom|꽃|벚꽃/i],
    subject: "Petal Bloom",
    motif: "flower",
    shapePreset: "soft-blob",
    behavior: "petal clusters and soft bloom halos around the cursor tip",
    scene: "petal bloom desktop with delicate floral light trails",
    elements: ["petals", "bloom"]
  },
  {
    patterns: [/butterfly|나비/i],
    subject: "Butterfly Wing",
    motif: "butterfly",
    shapePreset: "slim-pointer",
    behavior: "butterfly wing side fins and light wingbeat traces",
    scene: "butterfly wing glow with airy symmetrical desktop accents",
    elements: ["butterfly wings"]
  },
  {
    patterns: [/crown|royal|king|queen|왕관|왕|여왕/i],
    subject: "Royal Crown",
    motif: "crown",
    shapePreset: "sharp-arrow",
    behavior: "crown points, gem-like highlights, and regal gold edges",
    scene: "royal glass desktop with crown-like luminous trim",
    elements: ["crown", "gem"]
  },
  {
    patterns: [/pixel|retro|8bit|8-bit|픽셀|레트로/i],
    subject: "Pixel Sprite",
    motif: "pixel-spark",
    shapePreset: "pixel-cursor",
    behavior: "chunky pixel corners, sprite-like accents, and stepped motion trails",
    scene: "retro pixel desktop with blocky neon grid highlights",
    elements: ["pixels", "sprite"]
  },
  {
    patterns: [/terminal|code|matrix|developer|코드|터미널|개발/i],
    subject: "Code Bracket",
    motif: "code-bracket",
    shapePreset: "sharp-arrow",
    behavior: "code bracket marks, terminal ticks, and precise cyan hotspots",
    scene: "terminal-inspired workspace with code bracket light marks",
    elements: ["code brackets", "terminal ticks"]
  },
  {
    patterns: [/web|spider|스파이더|거미/i],
    subject: "Web Arc",
    motif: "web-arc",
    shapePreset: "sharp-arrow",
    behavior: "elastic web arcs and agile red-blue click trails",
    scene: "web arc desktop with elastic curved light strands",
    elements: ["web arcs"]
  },
  {
    patterns: [/robot|mecha|gundam|cyber|mech|로봇|메카/i],
    subject: "Mech Panel",
    motif: "mech-panel",
    shapePreset: "weapon-pointer",
    behavior: "mech panel cuts, reactor dots, and angular armor bevels",
    scene: "mech cockpit desktop with angular panel readouts",
    elements: ["mech panels", "reactor dots"]
  },
  {
    patterns: [/magic|star|sparkle|wizard|마법|별|스파클/i],
    subject: "Magic Star",
    motif: "magic-sparkle",
    shapePreset: "halo-ring",
    behavior: "star glyphs, sparkle halos, and magical focus rings",
    scene: "magical star desktop with soft transformation sparkles",
    elements: ["stars", "sparkles"]
  },
  {
    patterns: [/ninja|katana|sword|blade|검|칼|닌자/i],
    subject: "Blade Slash",
    motif: "slash",
    shapePreset: "weapon-pointer",
    behavior: "blade-like edges, slash trails, and aggressive directionality",
    scene: "dark blade desktop with diagonal slash energy",
    elements: ["blade", "slash trails"]
  }
];

function getById<T extends { id: string }>(items: T[], id: string | undefined, fallback: T) {
  return items.find((item) => item.id === id) ?? fallback;
}

export function getCursorConcept(id?: string) {
  return getById(cursorConcepts, id, cursorConcepts[0]);
}

export function getColorMood(id?: string) {
  return getById(colorMoods, id, colorMoods[0]);
}

export function getShapePreset(id?: string) {
  return getById(shapePresets, id, shapePresets[0]);
}

function normalizeHex(value: string | undefined, fallback: string) {
  if (!value) return fallback;
  return /^#[0-9a-f]{6}$/i.test(value.trim()) ? value.trim() : fallback;
}

function hashString(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function pick<T>(items: T[], hash: number, offset = 0) {
  return items[(hash + offset) % items.length];
}

function paletteFromColors(name: string, colors: string[]): PaletteColor[] {
  return [
    { name: `${name} Accent`, hex: colors[0] },
    { name: `${name} Secondary`, hex: colors[1] },
    { name: "Ink Base", hex: colors[2] },
    { name: "Highlight", hex: colors[3] }
  ];
}

function paletteFromReference(colors: string[] | undefined): PaletteColor[] | undefined {
  const valid = colors?.filter((color) => /^#[0-9a-f]{6}$/i.test(color)).slice(0, 4);
  if (!valid?.length) return undefined;
  const fallback = ["#27f2ff", "#ff3bd5", "#05070d", "#f8fafc"];
  const padded = [0, 1, 2, 3].map((index) => valid[index] ?? fallback[index]);

  return [
    { name: "Reference Accent", hex: padded[0] },
    { name: "Reference Secondary", hex: padded[1] },
    { name: "Reference Base", hex: padded[2] },
    { name: "Reference Highlight", hex: padded[3] }
  ];
}

function resolveSelection(input: GenerateRequest) {
  const defaults = input.themeId ? themeDefaults[input.themeId] : undefined;
  const concept = getCursorConcept(input.cursorConcept ?? defaults?.cursorConcept);
  const mood = getColorMood(input.colorMood ?? defaults?.colorMood);
  const shape = getShapePreset(input.shapePreset ?? defaults?.shapePreset ?? concept.defaultShape);

  return { concept, mood, shape };
}

function promptText(input: GenerateRequest) {
  return [input.prompt, input.detailPrompt].filter(Boolean).join(" ").trim();
}

function createPromptDesign(input: GenerateRequest): PromptDesign {
  const text = promptText(input);
  const matches = (patterns: RegExp[]) => patterns.some((pattern) => pattern.test(text));
  const rule = promptRules.find((item) => matches(item.patterns));
  const colorRule = promptColorPalettes.find((item) => matches(item.patterns));

  if (!text && !rule && !colorRule) {
    return { elements: [] };
  }

  const fallbackSubject = text
    ? text
        .replace(/#[0-9a-f]{3,6}/gi, "")
        .replace(/[^\p{L}\p{N}\s-]/gu, " ")
        .trim()
        .split(/\s+/)
        .slice(0, 3)
        .join(" ")
    : undefined;

  return {
    subject: rule?.subject ?? fallbackSubject,
    motif: rule?.motif ?? (fallbackSubject ? "prompt-glyph" : undefined),
    shapePreset: rule?.shapePreset,
    accentName: colorRule?.name,
    palette: colorRule ? paletteFromColors(colorRule.name, colorRule.colors) : undefined,
    behavior: rule?.behavior ?? (fallbackSubject ? `abstract glyph details based on "${fallbackSubject}"` : undefined),
    scene: rule?.scene ?? (fallbackSubject ? `desktop theme shaped around ${fallbackSubject} as an abstract cursor motif` : undefined),
    elements: rule?.elements ?? (fallbackSubject ? [fallbackSubject] : [])
  };
}

export function paletteFromSelection(input: GenerateRequest): PaletteColor[] {
  const { concept, mood } = resolveSelection(input);
  const accent =
    mood.id === "custom-solid"
      ? normalizeHex(input.customColor, mood.colors[0])
      : mood.colors[0];
  const secondary = mood.colors[1] ?? concept.palette[1];
  const dark = mood.colors[2] ?? concept.palette[2];
  const light = mood.colors[3] ?? concept.palette[3];

  return [
    { name: `${mood.name} Accent`, hex: accent },
    { name: "Secondary Glow", hex: secondary },
    { name: "Ink Base", hex: dark },
    { name: "Highlight", hex: light }
  ];
}

export function createLocalThemeAnalysis(input: GenerateRequest): ThemeAnalysis {
  const { concept, mood, shape } = resolveSelection(input);
  const detail = input.detailPrompt?.trim() || input.prompt?.trim();
  const promptDesign = createPromptDesign(input);
  const referencePalette = paletteFromReference(input.referenceColors);
  const referenceDriven = Boolean(referencePalette && !promptDesign.subject);
  const promptSubject = promptDesign.subject ?? (referenceDriven ? "Reference Image" : undefined);
  const promptElements = promptDesign.elements.length
    ? promptDesign.elements
    : referenceDriven
      ? ["uploaded image palette", "reference color accents"]
      : [];
  const effectiveShape = promptDesign.shapePreset
    ? getShapePreset(promptDesign.shapePreset)
    : shape;
  const effectiveMotif = promptDesign.motif ?? (referenceDriven ? "prompt-glyph" : concept.motif);
  const seed = hashString(
    [
      input.variationSeed,
      input.themeId,
      input.themeName,
      input.cursorConcept,
      input.colorMood,
      input.shapePreset,
      detail
    ]
      .filter(Boolean)
      .join("|")
  );
  const variant = pick(variantWords, seed);
  const scene = promptDesign.scene
    ?? (referenceDriven
      ? "desktop theme built from the uploaded image palette and reference-image contrast"
      : pick(wallpaperScenes, seed, 3));
  const cursorBehavior = promptDesign.behavior
    ?? (referenceDriven
      ? "uploaded-image color blocking, reference palette glow, and abstract source-image glyph marks"
      : pick(cursorBehaviors, seed, 7));
  const titleBase = promptSubject || input.themeName || concept.name;
  const palette = promptDesign.palette ?? paletteFromSelection(input);
  const accentName = promptDesign.accentName ?? mood.name;

  return {
    title: `${titleBase} ${variant}`,
    mood: `${concept.description} ${mood.description} Cursor treatment: ${cursorBehavior}.${detail ? ` Prompt: ${detail}.` : ""}`,
    palette: promptDesign.palette ?? referencePalette ?? palette,
    cursorStyle: {
      shape: `${effectiveShape.name}, ${cursorBehavior}`,
      accent: accentName,
      glow: mood.id === "mono-white" ? "soft" : "strong",
      density: effectiveShape.id === "pixel-cursor" ? "minimal" : "detailed",
      concept: concept.id,
      motif: effectiveMotif,
      shapePreset: effectiveShape.id,
      variant,
      promptSubject,
      promptElements
    },
    wallpaperPrompt: `${concept.promptSeed}. ${mood.description}. ${scene}. Cursor-first desktop theme, ${effectiveShape.description}. ${cursorBehavior}. ${detail ?? ""}`
  };
}
