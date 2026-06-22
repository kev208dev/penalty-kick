import { NextResponse } from "next/server";
import { createLocalThemeAnalysis } from "@/app/lib/cursor-presets";
import { createCssSnippet, createCursorAssets } from "@/app/lib/cursors";
import { analyzeTheme, canUseOpenRouter, generateWallpaper } from "@/app/lib/openrouter";
import { createFallbackWallpaperDataUrl } from "@/app/lib/wallpaper";
import type { GenerateRequest } from "@/app/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

function isValidDataUrl(value: string) {
  return /^data:image\/(png|jpe?g|webp);base64,/i.test(value);
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  const input = (await request.json()) as GenerateRequest;
  const cleanInput: GenerateRequest = {
    themeId: input.themeId,
    themeName: input.themeName?.slice(0, 80),
    themeDescription: input.themeDescription?.slice(0, 280),
    prompt: input.prompt?.slice(0, 1200),
    variationSeed: input.variationSeed?.slice(0, 80),
    cursorConcept: input.cursorConcept,
    colorMood: input.colorMood,
    shapePreset: input.shapePreset,
    customColor: input.customColor,
    detailPrompt: input.detailPrompt?.slice(0, 500),
    imageDataUrl:
      input.imageDataUrl && isValidDataUrl(input.imageDataUrl)
        ? input.imageDataUrl
        : undefined,
    referenceColors: Array.isArray(input.referenceColors)
      ? input.referenceColors
          .filter((color) => /^#[0-9a-f]{6}$/i.test(color))
          .slice(0, 4)
      : undefined
  };

  if (
    !cleanInput.cursorConcept &&
    !cleanInput.colorMood &&
    !cleanInput.shapePreset &&
    !cleanInput.themeName &&
    !cleanInput.prompt &&
    !cleanInput.detailPrompt &&
    !cleanInput.imageDataUrl
  ) {
    return NextResponse.json(
      { error: "Choose a cursor vibe, color mood, or shape first." },
      { status: 400 }
    );
  }

  try {
    const localAnalysis = createLocalThemeAnalysis(cleanInput);
    const analysis = apiKey && canUseOpenRouter()
      ? await analyzeTheme(cleanInput, apiKey)
      : localAnalysis;
    analysis.cursorStyle.concept ??= localAnalysis.cursorStyle.concept;
    analysis.cursorStyle.motif ??= localAnalysis.cursorStyle.motif;
    analysis.cursorStyle.shapePreset ??= localAnalysis.cursorStyle.shapePreset;
    analysis.cursorStyle.variant ??= localAnalysis.cursorStyle.variant;
    analysis.cursorStyle.promptSubject ??= localAnalysis.cursorStyle.promptSubject;
    analysis.cursorStyle.promptElements ??= localAnalysis.cursorStyle.promptElements;
    analysis.palette = analysis.palette.length ? analysis.palette : localAnalysis.palette;

    let wallpaperDataUrl: string;

    try {
      if (!apiKey) throw new Error("OPENROUTER_API_KEY is missing; using local wallpaper.");
      if (!canUseOpenRouter()) throw new Error("OpenRouter is temporarily paused; using local wallpaper.");
      wallpaperDataUrl = await generateWallpaper(analysis, apiKey);
    } catch (error) {
      console.warn("OpenRouter image fallback:", errorMessage(error));
      wallpaperDataUrl = createFallbackWallpaperDataUrl(analysis);
    }

    const cursors = createCursorAssets(analysis);
    const cssSnippet = createCssSnippet(analysis);

    return NextResponse.json({
      analysis,
      wallpaperDataUrl,
      cursors,
      cssSnippet
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "CursorOS could not generate this theme."
      },
      { status: 500 }
    );
  }
}
