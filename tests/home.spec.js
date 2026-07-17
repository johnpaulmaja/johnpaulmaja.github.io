import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("homepage loads with correct title", async ({ page }) => {
  await expect(page).toHaveTitle("John Paul Maja — QA Specialist");
});

test("nav links scroll to the correct sections", async ({ page }) => {
  const sections = ["About", "Skills", "Experience", "Education", "Contact", "References"];

  for (const name of sections) {
    await page.getByRole("link", { name, exact: true }).click();
    await expect(page.locator(`#${name.toLowerCase()}`)).toBeInViewport();
  }
});

test("logo link returns to hero section", async ({ page }) => {
  await page.getByRole("link", { name: "Skills" }).click();
  await page.getByRole("link", { name: "[JPM]_" }).click();
  await expect(page.locator("#hero")).toBeInViewport();
});

test("hero CTA jumps to contact section", async ({ page }) => {
  await page.getByRole("link", { name: "Get in touch →" }).click();
  await expect(page.locator("#contact")).toBeInViewport();
});

test("contact email link has correct mailto address", async ({ page }) => {
  const emailLink = page.getByRole("link", { name: "johnpaulmaja5@gmail.com" });
  await expect(emailLink).toHaveAttribute("href", "mailto:johnpaulmaja5@gmail.com");
});

test("LinkedIn link points to the correct profile", async ({ page }) => {
  const linkedin = page.getByRole("link", { name: "LinkedIn →" });
  await expect(linkedin).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/john-paul-maja-060392245"
  );
});

test("GitHub link points to the correct profile", async ({ page }) => {
  const github = page.getByRole("link", { name: "GitHub →" });
  await expect(github).toHaveAttribute("href", "https://github.com/johnpaulmaja");
});

test("education section shows Cum Laude and Dean's Lister honors", async ({ page }) => {
  await page.getByRole("link", { name: "Education", exact: true }).click();
  await expect(page.locator("#education").getByText("Cum Laude")).toBeVisible();
  await expect(
    page.locator("#education").getByText("Consecutive Dean's Lister")
  ).toBeVisible();
});
