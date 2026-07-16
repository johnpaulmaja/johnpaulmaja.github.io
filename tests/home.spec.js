import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://127.0.0.1:5500/");
  await page.getByRole("link", { name: "Skills" }).click();
  await page.getByRole("link", { name: "Experience" }).click();
  await page.getByRole("link", { name: "Education" }).click();
  await page.getByRole("link", { name: "Contact" }).click();
  await page.getByRole("link", { name: "References" }).click();
  await page.getByRole("link", { name: "About" }).click();
  await page.getByRole("link", { name: "Get in touch →" }).click();
  await page.getByRole("link", { name: "johnpaulmaja5@gmail.com" }).click();
  const [page1] = await Promise.all([
    page.waitForEvent("popup"),
    page.getByRole("link", { name: "LinkedIn →" }).click(),
  ]);
  const [page2] = await Promise.all([
    page.waitForEvent("popup"),
    page.getByRole("link", { name: "GitHub →" }).click(),
  ]);
  await page.getByText("+63 995 751").click();
  await page.locator("#education").getByText("Cum Laude").click();
  await page.getByText("Consecutive Dean's Lister").click();
  await page
    .locator("div")
    .filter({ hasText: "Shopify Web Developer Dalayon" })
    .nth(1)
    .click();
  await page.getByText("Performance Testing Basics").click();
  await page.getByText("PHP / Java / C++").click();
  await page.getByText("Front-End Debugging").click();
  await page.getByText("// 01 — About Detail-first.").click();
  await page.getByText("Open to opportunities").click();
  await page.getByRole("link", { name: "[JPM]_" }).click();
  await page.goto("http://127.0.0.1:5500/#hero");
});
