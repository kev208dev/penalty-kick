export type ThemePreset = {
  id: string;
  name: string;
  label: string;
  description: string;
  colors: string[];
  promptSeed: string;
  cursorConcept?: string;
  colorMood?: string;
  shapePreset?: string;
};

export type PaletteColor = {
  name: string;
  hex: string;
};

export type CursorStyle = {
  shape: string;
  accent: string;
  glow: "soft" | "strong";
  density: "minimal" | "detailed";
  concept?: string;
  motif?: string;
  shapePreset?: string;
  variant?: string;
  promptSubject?: string;
  promptElements?: string[];
};

export type ThemeAnalysis = {
  title: string;
  mood: string;
  palette: PaletteColor[];
  cursorStyle: CursorStyle;
  wallpaperPrompt: string;
};

export type CursorAsset = {
  id: string;
  name: string;
  role: string;
  svg: string;
};

export type GenerateRequest = {
  themeId?: string;
  themeName?: string;
  themeDescription?: string;
  prompt?: string;
  variationSeed?: string;
  cursorConcept?: string;
  colorMood?: string;
  shapePreset?: string;
  customColor?: string;
  detailPrompt?: string;
  imageDataUrl?: string;
  referenceColors?: string[];
};

export type GenerateResult = {
  analysis: ThemeAnalysis;
  wallpaperDataUrl: string;
  cursors: CursorAsset[];
  cssSnippet: string;
};
