import { expect, test } from "@playwright/test";
import fs from "fs";

const testImage = "/tmp/cursoros-test.png";
const testImageBase64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADUlEQVR42mP8z8BQDwAFgwJ/lQn8WQAAAABJRU5ErkJggg==";

test("CursorOS upload and generate stays visually intact", async ({ page }) => {
  test.setTimeout(90000);
  fs.writeFileSync(testImage, Buffer.from(testImageBase64, "base64"));

  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
  await page.getByLabel("Prompt").fill("miku");
  await page.setInputFiles('input[type="file"]', testImage);

  const referenceImage = page.locator('img[alt="Uploaded reference"]');
  await expect(referenceImage).toBeVisible();
  await expect(page.getByText("cursoros-test.png")).toBeVisible();

  const generateButton = page.getByRole("button", {
    name: /Generate OS Theme|Regenerate OS Theme|Generating|Optimizing image/
  });
  await expect(generateButton).toBeVisible();
  await generateButton.click();

  await expect(page.getByText("Pointer", { exact: true })).toBeVisible({
    timeout: 90000
  });
  await expect(page.getByRole("heading", { name: /Teal Vocal Synth/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Slim Pointer/ })).toBeVisible();
  await expect(page.getByText("Default select")).toBeVisible();
  await expect(referenceImage).toBeVisible();

  const result = await page.evaluate(() => {
    const ref = document.querySelector('img[alt="Uploaded reference"]');
    const wallpaper = document.querySelector('img[alt="Generated wallpaper"]');
    const cursorCards = Array.from(document.querySelectorAll("section")).find((section) =>
      section.textContent?.includes("Cursor Set")
    );
    const buttonTexts = Array.from(document.querySelectorAll("button"))
      .map((button) => button.textContent?.trim())
      .filter(Boolean);

    return {
      referenceNaturalWidth: ref?.naturalWidth ?? 0,
      referenceHeight: ref?.getBoundingClientRect().height ?? 0,
      wallpaperNaturalWidth: wallpaper?.naturalWidth ?? 0,
      wallpaperHeight: wallpaper?.getBoundingClientRect().height ?? 0,
      cursorSetText:
        cursorCards?.textContent?.replace(/\s+/g, " ").trim().slice(0, 240) ?? "",
      buttonTexts
    };
  });

  expect(result.referenceNaturalWidth).toBeGreaterThan(0);
  expect(result.wallpaperNaturalWidth).toBeGreaterThan(0);
  console.log(JSON.stringify(result, null, 2));

  await expect(generateButton).toHaveText(/Regenerate OS Theme/);
  const firstTitle = await page.locator("h2").filter({ hasText: /Teal Vocal Synth/ }).first().textContent();
  await generateButton.click();
  await expect
    .poll(
      async () =>
        page
          .locator("h2")
          .filter({ hasText: /Teal Vocal Synth/ })
          .first()
          .textContent(),
      { timeout: 90000 }
    )
    .not.toBe(firstTitle);
  await expect(generateButton).toHaveText(/Regenerate OS Theme/, {
    timeout: 90000
  });

  await page.screenshot({ path: "/tmp/cursoros-ui-result.png", fullPage: true });
});
