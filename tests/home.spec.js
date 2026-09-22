import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("homepage loads with correct title", async ({ page }) => {
  await expect(page).toHaveTitle("John Paul Maja — QA Analyst");
});

test("nav links scroll to the correct sections", async ({ page }) => {
  const sections = [
    "About",
    "Skills",
    "Experience",
    "Projects",
    "Education",
    "Contact",
    "References",
  ];

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

test("projects section links to each GitHub repository", async ({ page }) => {
  const repos = ["login-qa-demo", "capture_explain", "image-overlay-utility"];
  const projects = page.locator("#projects");

  for (const repo of repos) {
    const link = projects.getByRole("link", { name: `github.com/johnpaulmaja/${repo} →` });
    await expect(link).toHaveAttribute("href", `https://github.com/johnpaulmaja/${repo}`);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
});

test("earlier work links open safely in a new tab with unique names", async ({ page }) => {
  const links = page.locator("#projects .archive a");
  await expect(links).not.toHaveCount(0);

  const names = [];
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    // Thumbnail links are named by their image's alt text
    names.push(
      await link.evaluate((el) => el.textContent.trim() || el.querySelector("img")?.alt)
    );
  }
  expect(new Set(names).size).toBe(names.length);
});

test("Archies Footwear card sits above the SEOHacker sites and links to the live store", async ({ page }) => {
  const link = page.getByRole("link", { name: "archiesfootwear.com →" });
  await expect(link).toHaveAttribute("href", "https://archiesfootwear.com/");
  await expect(link).toHaveAttribute("rel", "noopener noreferrer");

  const cardTop = await link.evaluate((el) => el.closest("article").getBoundingClientRect().top);
  const qaTop = await page.locator("#qa-sites").evaluate((el) => el.getBoundingClientRect().top);
  expect(cardTop).toBeLessThan(qaTop);
});

test("SEOHacker client sites link out safely and are reachable from Experience", async ({ page }) => {
  const sites = page.locator("#qa-sites a.qa-site");
  await expect(sites).not.toHaveCount(0);

  for (const site of await sites.all()) {
    await expect(site).toHaveAttribute("href", /^https:\/\//);
    await expect(site).toHaveAttribute("target", "_blank");
    await expect(site).toHaveAttribute("rel", "noopener noreferrer");
    await expect(site.locator(".qa-site-name")).not.toBeEmpty();
  }

  await page.getByRole("link", { name: "See the client sites I handled →" }).click();
  await expect(page.locator("#qa-sites")).toBeInViewport();
});

test("project screenshots load", async ({ page }) => {
  const screenshots = page.locator("#projects img");
  await expect(screenshots).not.toHaveCount(0);

  for (const img of await screenshots.all()) {
    await img.scrollIntoViewIfNeeded();
    // Empty alt is allowed for decorative images inside an already-labelled link
    expect(await img.getAttribute("alt")).not.toBeNull();
    await expect
      .poll(() => img.evaluate((el) => el.complete && el.naturalWidth > 0))
      .toBe(true);
  }
});

test("education section shows Cum Laude and Dean's Lister honors", async ({ page }) => {
  await page.getByRole("link", { name: "Education", exact: true }).click();
  await expect(page.locator("#education").getByText("Cum Laude")).toBeVisible();
  await expect(
    page.locator("#education").getByText("Consecutive Dean's Lister")
  ).toBeVisible();
});
