import type { ThemePreset } from "./types";

export const themePresets: ThemePreset[] = [
  {
    id: "neon-dev",
    name: "Neon Dev",
    label: "개발자",
    description: "Terminal black, cyan scanlines, compact productivity energy.",
    colors: ["#04f5ff", "#7c3cff", "#111827", "#e6ff4f"],
    promptSeed: "futuristic developer desk, neon terminal glow, cyber grid, focused productivity",
    cursorConcept: "cyber-ninja",
    colorMood: "neon-cyan",
    shapePreset: "sharp-arrow"
  },
  {
    id: "arc-minimal",
    name: "Arc Minimal",
    label: "생산성",
    description: "Soft glass panels, quiet gradients, clean OS chrome.",
    colors: ["#8bd3ff", "#f7b7ff", "#161a22", "#f8fafc"],
    promptSeed: "minimal browser inspired desktop, glass panels, soft luminous edges, calm productivity",
    cursorConcept: "magical-guardian",
    colorMood: "mono-white",
    shapePreset: "halo-ring"
  },
  {
    id: "synth-gamer",
    name: "Synth Gamer",
    label: "게이밍",
    description: "High contrast magenta, teal bloom, sharp input feedback.",
    colors: ["#ff2bd6", "#15ffd5", "#05070d", "#ffd166"],
    promptSeed: "cyberpunk gaming setup, magenta teal neon, glossy black hardware, energetic motion",
    cursorConcept: "retro-mecha",
    colorMood: "electric-blue",
    shapePreset: "weapon-pointer"
  },
  {
    id: "studio-aura",
    name: "Studio Aura",
    label: "디자인",
    description: "Editorial color, premium glow, polished creative workflow.",
    colors: ["#ff6f91", "#67e8f9", "#101014", "#fdf4ff"],
    promptSeed: "premium creative studio desktop, glassmorphism interface, vivid but refined color aura",
    cursorConcept: "virtual-idol",
    colorMood: "cherry-pink",
    shapePreset: "slim-pointer"
  }
];

export function getThemeById(id?: string) {
  return themePresets.find((theme) => theme.id === id) ?? themePresets[0];
}
