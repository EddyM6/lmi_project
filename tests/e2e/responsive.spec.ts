import { expect, test } from "@playwright/test";

test("renders key sections on first load", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "language switcher" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Լևոն և Մարի|Левон и Мари|Levon & Mari/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Ուղարկել|Отправить|Submit/i })).toBeVisible();
});

test("supports reduced motion preference", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Time Remaining|Մնացել է|Осталось/i })).toBeVisible();
  await context.close();
});
