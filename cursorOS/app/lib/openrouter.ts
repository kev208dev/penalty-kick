import {
  createLocalThemeAnalysis,
  getColorMood,
  getCursorConcept,
  getShapePreset
} from "./cursor-presets";
import type { GenerateRequest, ThemeAnalysis } from "./types";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_FAILURE_PAUSE_MS = 5 * 60 * 1000;

let openRouterPausedUntil = 0;

type OpenRouterMessage = {
  role: "system" | "user";
  content:
    | string
    | Array<
        | { type: "text"; text: string }
        | { type: "image_url"; image_url: { url: string } }
      >;
};

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string;
      images?: Array<{
        type?: string;
        image_url?: { url?: string };
        imageUrl?: { url?: string };
        url?: string;
      }>;
    };
  }>;
  error?: {
    message?: string;
  };
};

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function shouldPauseOpenRouter(error: unknown) {
  const message = errorMessage(error).toLowerCase();
  return (
    message.includes("insufficient credits") ||
    message.includes("never purchased credits") ||
    message.includes("402") ||
    message.includes("rate limit")
  );
}

function pauseOpenRouterIfNeeded(error: unknown) {
  if (shouldPauseOpenRouter(error)) {
    openRouterPausedUntil = Date.now() + OPENROUTER_FAILURE_PAUSE_MS;
  }
}

export function canUseOpenRouter() {
  return Date.now() >= openRouterPausedUntil;
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }
}

function modelHeaders(apiKey: string) {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "CursorOS"
  };
}

function extractJson(content: string | undefined): ThemeAnalysis {
  if (!content) {
    throw new Error("The AI analysis response was empty.");
  }

  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  const raw = fenced ?? content;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("The AI analysis response did not include JSON.");
  }

  const parsed = JSON.parse(raw.slice(start, end + 1)) as ThemeAnalysis;
  const palette = Array.isArray(parsed.palette)
    ? parsed.palette.slice(0, 5).map((color, index) => {
        const fallback = ["#27f2ff", "#ff3bd5", "#05070d", "#d8ff4f", "#f8fafc"][index] ?? "#f8fafc";
        const hex = color.hex?.match(/^#[0-9a-f]{6}/i)?.[0] ?? fallback;
        return {
          name: color.name || `Color ${index + 1}`,
          hex
        };
      })
    : [];

  return {
    title: parsed.title || "CursorOS Theme",
    mood: parsed.mood || "Cyber glass desktop",
    palette,
    cursorStyle: {
      shape: parsed.cursorStyle?.shape || "angular pointer",
      accent: parsed.cursorStyle?.accent || "neon edge",
      glow: parsed.cursorStyle?.glow === "strong" ? "strong" : "soft",
      density: parsed.cursorStyle?.density === "detailed" ? "detailed" : "minimal",
      concept: parsed.cursorStyle?.concept,
      motif: parsed.cursorStyle?.motif,
      shapePreset: parsed.cursorStyle?.shapePreset,
      variant: parsed.cursorStyle?.variant,
      promptSubject: parsed.cursorStyle?.promptSubject,
      promptElements: Array.isArray(parsed.cursorStyle?.promptElements)
        ? parsed.cursorStyle.promptElements.slice(0, 6)
        : undefined
    },
    wallpaperPrompt:
      parsed.wallpaperPrompt ||
      "16:9 futuristic dark desktop wallpaper, glassmorphism, neon cyberpunk glow, clean negative space"
  };
}

export async function analyzeTheme(input: GenerateRequest, apiKey: string) {
  const textModel = process.env.OPENROUTER_TEXT_MODEL || "google/gemini-3.1-flash-lite";
  const localAnalysis = createLocalThemeAnalysis(input);
  if (!canUseOpenRouter()) {
    return localAnalysis;
  }

  const concept = getCursorConcept(input.cursorConcept);
  const mood = getColorMood(input.colorMood);
  const shape = getShapePreset(input.shapePreset || concept.defaultShape);
  const userText = `Create a cohesive cursor-first desktop customization theme.

Selected app theme: ${input.themeName || "CursorOS"} (${input.themeDescription || "No description"})
Cursor concept: ${concept.name} (${concept.description})
Character vibe motif: ${concept.motif}
Color mood: ${mood.name} (${mood.description})
Cursor shape preset: ${shape.name} (${shape.description})
Optional detail: ${input.detailPrompt?.trim() || input.prompt?.trim() || "No extra detail"}
Image attached: ${input.imageDataUrl ? "yes" : "no"}
Variation seed: ${input.variationSeed || "fresh"}

Return JSON only with this exact shape:
{
  "title": "short brandable name",
  "mood": "one sentence mood",
  "palette": [{"name":"color name","hex":"#RRGGBB"}],
  "cursorStyle": {"shape":"short shape description based directly on the user's prompt","accent":"short accent description","glow":"soft or strong","density":"minimal or detailed","concept":"${concept.id}","motif":"motif keyword from the prompt, such as vocal-twintail, cat-ear, flame, heart, ice, flower, butterfly, crown, pixel-spark, code-bracket, ${concept.motif}","shapePreset":"best matching shape preset id","variant":"two or three words describing the cursor detailing","promptSubject":"main prompt subject rewritten as an original cursor concept","promptElements":["visible element 1","visible element 2"]},
  "wallpaperPrompt": "detailed image generation prompt for a 16:9 desktop wallpaper"
}`;

  const messages: OpenRouterMessage[] = [
    {
      role: "system",
      content:
        "You are CursorOS, an AI desktop cursor designer. Output compact valid JSON only. Let the user's prompt dominate the cursor design: subject, color palette, visible motif, silhouette, and details should come from the prompt more than the preset theme. Do not copy named copyrighted characters; transform names into original visual cues. Make repeated generations with the same app theme visibly distinct in cursor detailing and wallpaper composition."
    },
    {
      role: "user",
      content: input.imageDataUrl
        ? [
            { type: "text", text: userText },
            { type: "image_url", image_url: { url: input.imageDataUrl } }
          ]
        : userText
    }
  ];

  try {
    const response = await fetchWithTimeout(OPENROUTER_URL, {
      method: "POST",
      headers: modelHeaders(apiKey),
      body: JSON.stringify({
        model: textModel,
        messages,
        response_format: { type: "json_object" },
        max_tokens: 700,
        temperature: 0.7
      })
    }, 25000);

    const json = (await response.json()) as OpenRouterResponse;
    if (!response.ok) {
      throw new Error(json.error?.message || `OpenRouter analysis failed with ${response.status}`);
    }

    return extractJson(json.choices?.[0]?.message?.content);
  } catch (error) {
    pauseOpenRouterIfNeeded(error);
    console.warn("OpenRouter analysis fallback:", errorMessage(error));
    return localAnalysis;
  }
}

export async function generateWallpaper(analysis: ThemeAnalysis, apiKey: string) {
  if (!canUseOpenRouter()) {
    throw new Error("OpenRouter temporarily paused after provider failure.");
  }

  const imageModel = process.env.OPENROUTER_IMAGE_MODEL || "black-forest-labs/flux.2-klein-4b";
  try {
    const response = await fetchWithTimeout(OPENROUTER_URL, {
      method: "POST",
      headers: modelHeaders(apiKey),
      body: JSON.stringify({
        model: imageModel,
        messages: [
          {
            role: "user",
            content: `${analysis.wallpaperPrompt}

Requirements: 16:9 aspect ratio, premium dark desktop wallpaper, no text, no logos, room for icons, crisp neon glass UI ambience.`
          }
        ],
        max_tokens: 1200,
        modalities: ["image"],
        image_config: {
          aspect_ratio: "16:9",
          image_size: "1K"
        }
      })
    }, 55000);

    const json = (await response.json()) as OpenRouterResponse;
    if (!response.ok) {
      throw new Error(json.error?.message || `OpenRouter image generation failed with ${response.status}`);
    }

    const message = json.choices?.[0]?.message;
    const image =
      message?.images?.[0]?.image_url?.url ||
      message?.images?.[0]?.imageUrl?.url ||
      message?.images?.[0]?.url;

    if (!image) {
      throw new Error("OpenRouter did not return an image URL.");
    }

    return image;
  } catch (error) {
    pauseOpenRouterIfNeeded(error);
    throw error;
  }
}
