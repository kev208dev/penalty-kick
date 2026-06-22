"use client";

/* eslint-disable @next/next/no-img-element */
import { saveAs } from "file-saver";
import JSZip from "jszip";
import {
  Check,
  Cpu,
  Download,
  Image as ImageIcon,
  Layers,
  Loader2,
  Monitor,
  MousePointer2,
  Palette,
  Sparkles,
  Upload,
  X
} from "lucide-react";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { themePresets } from "@/app/lib/theme-presets";
import type { CursorAsset, GenerateResult, ThemePreset } from "@/app/lib/types";

const sampleTasks = ["terminal", "figma", "browser", "music"];
const maxReferenceDimension = 1280;
const referenceImageQuality = 0.82;
const fallbackCssSnippet = ":root {\n  --cursoros-accent: #27f2ff;\n}";

function svgColors(svg: string) {
  const matches = Array.from(new Set(svg.match(/#[0-9a-f]{6}/gi) ?? []));
  return {
    primary: matches[0] ?? "#27f2ff",
    secondary: matches[1] ?? "#ff3bd5",
    tertiary: matches[2] ?? "#d8ff4f"
  };
}

function CursorGlyph({
  cursor,
  size = 64
}: {
  cursor: CursorAsset;
  size?: number;
}) {
  const colors = svgColors(cursor.svg);
  const glow = `drop-shadow(0 0 10px ${colors.primary}) drop-shadow(0 0 24px ${colors.primary})`;
  const src = useMemo(
    () => `data:image/svg+xml;utf8,${encodeURIComponent(cursor.svg)}`,
    [cursor.svg]
  );

  return (
    <img
      aria-hidden="true"
      src={src}
      alt=""
      className="shrink-0 object-contain"
      style={{
        width: size,
        height: size,
        filter: glow
      }}
      decoding="async"
      draggable={false}
    />
  );
}

function dataUrlToBlob(dataUrl: string) {
  const [meta, data] = dataUrl.split(",");
  const mime = meta.match(/data:(.*?);/)?.[1] ?? "application/octet-stream";
  const binary = meta.includes(";base64") ? atob(data) : decodeURIComponent(data);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Blob([bytes], { type: mime });
}

function imageExtension(mime: string) {
  if (mime.includes("svg")) return "svg";
  if (mime.includes("webp")) return "webp";
  if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg";
  return "png";
}

async function imageToBlob(source: string) {
  if (source.startsWith("data:")) {
    return dataUrlToBlob(source);
  }

  const response = await fetch(source);
  if (!response.ok) {
    throw new Error("Could not download generated wallpaper.");
  }

  return response.blob();
}

function safeFilePart(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function createVariationSeed() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function compactCssSnippet(snippet: string | undefined) {
  if (!snippet) return fallbackCssSnippet;

  return snippet.replace(
    /url\("data:image\/svg\+xml,[^"]+"\)/g,
    'url("data:image/svg+xml,...")'
  );
}

function componentToHex(value: number) {
  return Math.max(0, Math.min(255, value)).toString(16).padStart(2, "0");
}

function rgbToHex(red: number, green: number, blue: number) {
  return `#${componentToHex(red)}${componentToHex(green)}${componentToHex(blue)}`;
}

function extractReferenceColors(
  context: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const sampleWidth = Math.min(96, width);
  const sampleHeight = Math.min(96, height);
  const imageData = context.getImageData(0, 0, width, height).data;
  const buckets = new Map<string, { count: number; score: number; r: number; g: number; b: number }>();

  for (let y = 0; y < sampleHeight; y += 1) {
    for (let x = 0; x < sampleWidth; x += 1) {
      const sourceX = Math.floor((x / sampleWidth) * width);
      const sourceY = Math.floor((y / sampleHeight) * height);
      const index = (sourceY * width + sourceX) * 4;
      const alpha = imageData[index + 3];
      if (alpha < 180) continue;

      const r = imageData[index];
      const g = imageData[index + 1];
      const b = imageData[index + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = max - min;
      const brightness = (r + g + b) / 3;
      if (brightness < 18 || brightness > 246) continue;

      const key = [r, g, b].map((value) => Math.round(value / 32) * 32).join("-");
      const bucket = buckets.get(key) ?? { count: 0, score: 0, r: 0, g: 0, b: 0 };
      bucket.count += 1;
      bucket.score += 1 + saturation / 64;
      bucket.r += r;
      bucket.g += g;
      bucket.b += b;
      buckets.set(key, bucket);
    }
  }

  const colors = Array.from(buckets.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((bucket) =>
      rgbToHex(
        Math.round(bucket.r / bucket.count),
        Math.round(bucket.g / bucket.count),
        Math.round(bucket.b / bucket.count)
      )
    );

  return colors.length ? colors : undefined;
}

async function optimizeReferenceImage(file: File, sourceUrl: string) {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read the uploaded image."));
    img.src = sourceUrl;
  });

  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const scale = Math.min(1, maxReferenceDimension / Math.max(sourceWidth, sourceHeight));
  const width = Math.max(1, Math.round(sourceWidth * scale));
  const height = Math.max(1, Math.round(sourceHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas is not available.");
  }

  context.fillStyle = "#05070d";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);
  const referenceColors = extractReferenceColors(context, width, height);

  if (file.type === "image/webp") {
    return {
      dataUrl: canvas.toDataURL("image/webp", referenceImageQuality),
      referenceColors
    };
  }

  return {
    dataUrl: canvas.toDataURL("image/jpeg", referenceImageQuality),
    referenceColors
  };
}

async function svgToPngBlob(svg: string, size = 256) {
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Could not render cursor SVG."));
      img.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas is not available.");
    }

    context.clearRect(0, 0, size, size);
    context.drawImage(image, 0, 0, size, size);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((png) => {
        if (png) resolve(png);
        else reject(new Error("Could not export cursor PNG."));
      }, "image/png");
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

function ThemeButton({
  theme,
  active,
  onSelect
}: {
  theme: ThemePreset;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group rounded-lg border p-3 text-left transition ${
        active
          ? "border-cyanGlow/80 bg-cyanGlow/10 shadow-glow"
          : "border-white/10 bg-white/[0.04] hover:border-white/24 hover:bg-white/[0.07]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{theme.name}</p>
          <p className="mt-1 text-xs text-slate-400">{theme.label}</p>
        </div>
        {active ? (
          <Check className="h-4 w-4 shrink-0 text-cyanGlow" aria-hidden="true" />
        ) : null}
      </div>
      <div className="mt-3 flex gap-1.5">
        {theme.colors.map((color) => (
          <span
            key={color}
            className="h-5 w-full rounded border border-white/10"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </button>
  );
}

function CursorPreview({ cursor }: { cursor: CursorAsset }) {
  const colors = svgColors(cursor.svg);

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.045] p-3">
      <div
        className="relative flex h-32 min-h-32 items-center justify-center overflow-hidden rounded-md border border-cyanGlow/20 bg-black/40"
        style={{
          background:
            `radial-gradient(circle at 50% 50%, ${colors.primary}2c, transparent 42%), linear-gradient(135deg, ${colors.primary}18, ${colors.secondary}10 45%, rgba(0,0,0,.35))`
        }}
      >
        <div
          className="absolute inset-x-6 top-4 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)` }}
        />
        <CursorGlyph cursor={cursor} size={76} />
        <span className="absolute bottom-2 right-2 rounded border border-white/10 bg-black/50 px-2 py-1 font-mono text-[10px] uppercase text-slate-300">
          {cursor.id}
        </span>
      </div>
      <p className="mt-3 text-sm font-semibold text-white">{cursor.name}</p>
      <p className="mt-1 text-xs text-slate-400">{cursor.role}</p>
    </div>
  );
}

function LivePreview({
  result,
  selectedTheme
}: {
  result: GenerateResult | null;
  selectedTheme: ThemePreset;
}) {
  const palette = result?.analysis.palette;
  const previewCursor = result?.cursors[0];
  const style = result?.wallpaperDataUrl
    ? { backgroundImage: `url(${result.wallpaperDataUrl})` }
    : undefined;

  return (
    <section className="glass scanline min-h-[420px] overflow-hidden rounded-lg">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Monitor className="h-4 w-4 text-cyanGlow" aria-hidden="true" />
          Live Preview
        </div>
      </div>
      <div
        className={`relative min-h-[376px] bg-cover bg-center ${result ? "" : "wallpaper-fallback"}`}
        style={style}
      >
        <div className="absolute inset-0 bg-black/18" />
        <div className="relative grid min-h-[376px] grid-cols-1 gap-4 p-4 md:grid-cols-[1fr_220px]">
          <div className="flex flex-col justify-between rounded-lg border border-white/12 bg-black/26 p-4 backdrop-blur-xl">
            <div>
              <p className="font-mono text-xs uppercase text-cyanGlow">CursorOS</p>
              <h2 className="mt-2 max-w-[560px] text-2xl font-semibold text-white sm:text-3xl">
                {result?.analysis.title ?? selectedTheme.name}
              </h2>
              <p className="mt-3 max-w-[540px] text-sm leading-6 text-slate-200">
                {result?.analysis.mood ?? selectedTheme.description}
              </p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {sampleTasks.map((task, index) => (
                <div
                  key={task}
                  className="rounded-md border border-white/10 bg-white/[0.08] p-3"
                >
                  <span
                    className="block h-7 w-7 rounded"
                    style={{
                      backgroundColor:
                        palette?.[index % Math.max(palette.length, 1)]?.hex ??
                        selectedTheme.colors[index % selectedTheme.colors.length]
                    }}
                  />
                  <p className="mt-3 text-xs font-medium uppercase text-slate-200">
                    {task}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-white/12 bg-black/32 p-4 backdrop-blur-xl">
            <p className="text-xs font-medium uppercase text-slate-400">Palette</p>
            <div className="mt-3 space-y-2">
              {(palette ?? selectedTheme.colors.map((hex, index) => ({
                name: `Preset ${index + 1}`,
                hex
              }))).slice(0, 5).map((color) => (
                <div key={`${color.name}-${color.hex}`} className="flex items-center gap-3">
                  <span
                    className="h-8 w-8 rounded border border-white/14"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-white">{color.name}</p>
                    <p className="font-mono text-xs text-slate-400">{color.hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {previewCursor ? (
          <div
            aria-hidden="true"
            className="floating-cursor absolute bottom-16 right-16"
          >
            <CursorGlyph cursor={previewCursor} size={58} />
          </div>
        ) : (
          <MousePointer2 className="absolute bottom-16 right-16 h-12 w-12 text-cyanGlow drop-shadow-[0_0_18px_rgba(39,242,255,0.72)]" />
        )}
      </div>
    </section>
  );
}

export default function Home() {
  const [selectedTheme, setSelectedTheme] = useState(themePresets[0]);
  const [prompt, setPrompt] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string>();
  const [referenceColors, setReferenceColors] = useState<string[]>();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>();
  const [imageName, setImageName] = useState("");
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isPreparingImage, setIsPreparingImage] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const imageJobRef = useRef(0);

  const canExport = Boolean(result && !isExporting);
  const promptCount = useMemo(() => prompt.trim().length, [prompt]);
  const hasReference = Boolean(imageDataUrl || imagePreviewUrl);
  const cssPreview = useMemo(() => compactCssSnippet(result?.cssSnippet), [result?.cssSnippet]);
  const generateLabel = isPreparingImage
    ? "Optimizing image..."
    : isGenerating
      ? "Generating..."
      : result
        ? "Regenerate OS Theme"
        : "Generate OS Theme";

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  function clearReference() {
    imageJobRef.current += 1;
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImagePreviewUrl(undefined);
    setImageDataUrl(undefined);
    setReferenceColors(undefined);
    setImageName("");
    setIsPreparingImage(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const imageJob = imageJobRef.current + 1;
    imageJobRef.current = imageJob;
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImagePreviewUrl(previewUrl);
    setImageDataUrl(undefined);
    setReferenceColors(undefined);
    setImageName(file.name);
    setError("");
    setIsPreparingImage(true);

    try {
      const optimizedImage = await optimizeReferenceImage(file, previewUrl);
      if (imageJobRef.current === imageJob) {
        setImageDataUrl(optimizedImage.dataUrl);
        setReferenceColors(optimizedImage.referenceColors);
      }
    } catch (caught) {
      if (imageJobRef.current === imageJob) {
        setError(caught instanceof Error ? caught.message : "Could not optimize the image.");
        setImageDataUrl(undefined);
      }
    } finally {
      if (imageJobRef.current === imageJob) {
        setIsPreparingImage(false);
      }
    }
  }

  async function generate() {
    if (isPreparingImage) return;

    setIsGenerating(true);
    setError("");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 90000);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        cache: "no-store",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          themeId: selectedTheme.id,
          themeName: selectedTheme.name,
          themeDescription: selectedTheme.description,
          variationSeed: createVariationSeed(),
          cursorConcept: selectedTheme.cursorConcept,
          colorMood: selectedTheme.colorMood,
          shapePreset: selectedTheme.shapePreset,
          prompt,
          imageDataUrl,
          referenceColors
        })
      });

      const payload = (await response.json()) as GenerateResult & { error?: string };
      if (!response.ok) {
        throw new Error(payload.error || "Generation failed.");
      }

      setResult(payload);
    } catch (caught) {
      setError(
        caught instanceof DOMException && caught.name === "AbortError"
          ? "Generation timed out. Try again with a shorter prompt or a smaller image."
          : caught instanceof Error
            ? caught.message
            : "Generation failed."
      );
    } finally {
      window.clearTimeout(timeout);
      setIsGenerating(false);
    }
  }

  async function exportPack() {
    if (!result) return;

    setIsExporting(true);
    setError("");

    try {
      const zip = new JSZip();
      zip.file("cursoros-theme.json", JSON.stringify(result.analysis, null, 2));
      zip.file("cursoros-cursors.css", result.cssSnippet);
      const wallpaperBlob = await imageToBlob(result.wallpaperDataUrl);
      zip.file(`wallpaper.${imageExtension(wallpaperBlob.type)}`, wallpaperBlob);

      const svgFolder = zip.folder("svg");
      const pngFolder = zip.folder("png");

      await Promise.all(
        result.cursors.map(async (cursor) => {
          svgFolder?.file(`${cursor.id}.svg`, cursor.svg);
          pngFolder?.file(`${cursor.id}.png`, await svgToPngBlob(cursor.svg));
        })
      );

      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, `${safeFilePart(result.analysis.title) || "cursoros"}-pack.zip`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Export failed.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden px-3 py-5 sm:px-5 lg:px-6">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-5 overflow-hidden">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyanGlow/40 bg-cyanGlow/10 shadow-glow">
                <MousePointer2 className="h-5 w-5 text-cyanGlow" aria-hidden="true" />
              </div>
              <div>
                <p className="font-mono text-xs uppercase text-cyanGlow">AI Desktop Theme Generator</p>
                <h1 className="text-3xl font-semibold text-white sm:text-4xl">CursorOS</h1>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="rounded-full border border-white/12 px-3 py-1.5">No login</span>
            <span className="rounded-full border border-white/12 px-3 py-1.5">OpenRouter</span>
            <span className="rounded-full border border-white/12 px-3 py-1.5">ZIP export</span>
          </div>
        </header>

        <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
          <aside className="glass h-fit min-w-0 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-xs uppercase text-slate-400">Input</p>
                <h2 className="mt-1 text-xl font-semibold text-white">Create Theme</h2>
              </div>
              <Sparkles className="h-5 w-5 text-pinkGlow" aria-hidden="true" />
            </div>

            <div className="mt-5 space-y-5">
              <section>
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                  <Layers className="h-4 w-4 text-cyanGlow" aria-hidden="true" />
                  Theme
                </div>
                <div className="grid gap-2">
                  {themePresets.map((theme) => (
                    <ThemeButton
                      key={theme.id}
                      theme={theme}
                      active={theme.id === selectedTheme.id}
                      onSelect={() => setSelectedTheme(theme)}
                    />
                  ))}
                </div>
              </section>

              <section>
                <label htmlFor="prompt" className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                  <Cpu className="h-4 w-4 text-volt" aria-hidden="true" />
                  Prompt
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  maxLength={1200}
                  placeholder="예: rainy Seoul night, glass taskbar, sharp cyan cursor..."
                  className="min-h-32 w-full resize-none rounded-lg border border-white/10 bg-black/32 p-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-500 focus:border-cyanGlow/70 focus:ring-2 focus:ring-cyanGlow/20"
                />
                <p className="mt-2 text-right font-mono text-xs text-slate-500">{promptCount}/1200</p>
              </section>

              <section>
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                  <ImageIcon className="h-4 w-4 text-pinkGlow" aria-hidden="true" />
                  Reference
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleImage}
                />
                {hasReference ? (
                  <div className="overflow-hidden rounded-lg border border-white/10 bg-black/24">
                    <img
                      src={imagePreviewUrl ?? imageDataUrl}
                      alt="Uploaded reference"
                      className="h-48 w-full bg-[#05070d] object-contain"
                      decoding="async"
                    />
                    <div className="flex items-center justify-between gap-3 px-3 py-2">
                      <p className="min-w-0 truncate text-xs text-slate-300">{imageName}</p>
                      <button
                        type="button"
                        onClick={clearReference}
                        className="rounded-md border border-white/10 p-1.5 text-slate-300 transition hover:border-pinkGlow/60 hover:text-white"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex min-h-36 w-full flex-col items-center justify-center rounded-lg border border-dashed border-pinkGlow/70 bg-pinkGlow/[0.1] px-4 text-center text-white transition hover:border-cyanGlow/70 hover:bg-cyanGlow/10"
                  >
                    <Upload className="h-7 w-7 text-pinkGlow" aria-hidden="true" />
                    <span className="mt-3 text-base font-bold">Upload image</span>
                    <span className="mt-1 text-xs text-slate-400">PNG / JPG / WEBP</span>
                  </button>
                )}
              </section>

              <button
                type="button"
                onClick={generate}
                disabled={isGenerating || isPreparingImage}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-cyanGlow/55 bg-cyanGlow/15 text-sm font-semibold text-white shadow-glow transition hover:bg-cyanGlow/25 disabled:border-slate-700 disabled:bg-slate-800 disabled:text-slate-400"
              >
                {isGenerating || isPreparingImage ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                )}
                {generateLabel}
              </button>

              {error ? (
                <div className="rounded-lg border border-pinkGlow/35 bg-pinkGlow/10 p-3 text-sm leading-6 text-pink-100">
                  {error}
                </div>
              ) : null}
            </div>
          </aside>

          <div className="min-w-0 space-y-5">
            <LivePreview result={result} selectedTheme={selectedTheme} />

            <div className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1fr)_minmax(260px,320px)]">
              <section className="glass min-w-0 rounded-lg p-4">
                <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-mono text-xs uppercase text-slate-400">Cursor Set</p>
                    <h2 className="mt-1 text-xl font-semibold text-white">
                      {result ? result.analysis.cursorStyle.shape : "Preview Pack"}
                    </h2>
                  </div>
                  <button
                    type="button"
                    disabled={!canExport}
                    onClick={exportPack}
                    className="flex h-10 items-center justify-center gap-2 rounded-lg border border-white/12 px-4 text-sm font-semibold text-white transition hover:border-cyanGlow/70 hover:bg-cyanGlow/10 disabled:text-slate-500"
                  >
                    {isExporting ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Download className="h-4 w-4" aria-hidden="true" />
                    )}
                    Download ZIP
                  </button>
                </div>
                {result ? (
                  <div className="mt-4 grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
                    {result.cursors.map((cursor) => (
                      <CursorPreview key={cursor.id} cursor={cursor} />
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 grid min-h-48 place-items-center rounded-lg border border-white/10 bg-white/[0.035] p-6 text-center">
                    <div>
                      <MousePointer2 className="mx-auto h-9 w-9 text-cyanGlow" aria-hidden="true" />
                      <p className="mt-3 text-sm font-medium text-slate-300">Cursor pack pending</p>
                    </div>
                  </div>
                )}
              </section>

              <section className="glass min-w-0 rounded-lg p-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <p className="font-mono text-xs uppercase text-slate-400">Output</p>
                    <h2 className="mt-1 text-xl font-semibold text-white">Assets</h2>
                  </div>
                  <Palette className="h-5 w-5 text-volt" aria-hidden="true" />
                </div>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="mb-2 text-sm font-semibold text-white">Wallpaper</p>
                    <div className="aspect-video overflow-hidden rounded-lg border border-white/10 bg-black/24">
                      {result?.wallpaperDataUrl ? (
                        <img
                          src={result.wallpaperDataUrl}
                          alt="Generated wallpaper"
                          className="h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="wallpaper-fallback h-full w-full" />
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-semibold text-white">CSS Snippet</p>
                    <pre className="max-h-40 max-w-full overflow-auto whitespace-pre-wrap break-all rounded-lg border border-white/10 bg-black/38 p-3 text-xs leading-5 text-slate-300">
                      {cssPreview}
                    </pre>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
