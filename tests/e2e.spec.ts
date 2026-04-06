import { test, expect } from "@playwright/test";

test.describe("SubSync SDI Assignment - Silver & Gold", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/login"]');
    await page.fill('input[id="email"]', "demo@subsync.com");
    await page.fill('input[id="password"]', "password123");
    await page.click('button[type="submit"]');
  });

  // --- SILVER---
  test("Silver: System monitors user activity using cookies", async ({ page, context }) => {
    await page.goto("/dashboard");
    const cookies = await context.cookies();
    const activityCookie = cookies.find(c => c.name === 'user-activity' || c.name === 'preferences');
    expect(activityCookie).toBeDefined();
  });

  // --- SILVER ---
  test("Silver: Feature 1 - Add Subscription (CRUD) [cite: 21]", async ({ page }) => {
    await page.click('button:has-text("Add Subscription")');
    await page.fill('input[placeholder="Netflix"]', "Disney Plus");
    await page.fill('input[placeholder="9.99"]', "13.99");
    await page.fill('input[type="date"]', "2026-04-15");
    await page.click('button[type="submit"]:has-text("Add Subscription")');
    await expect(page.locator("td:has-text('Disney Plus')")).toBeVisible();
  });

  test("Silver: Feature 2 - Master to Detail Navigation [cite: 20, 34]", async ({ page }) => {
    const firstName = await page.locator("tbody tr").first().locator("td").first().textContent();
    await page.locator("tbody tr").first().click();
    await expect(page).toHaveURL(/\/subscription\/.*/);
    await expect(page.locator("h1")).toContainText(firstName || "");
  });

  test("Silver: Feature 3 - Delete Subscription [cite: 21]", async ({ page }) => {
    const rowsBefore = await page.locator("tbody tr").count();
    await page.locator("tbody tr").first().locator('button').last().click();
    const rowsAfter = await page.locator("tbody tr").count();
    expect(rowsAfter).toBe(rowsBefore - 1);
  });

  // --- GOLD  ---
  test("Gold: Charts update automatically when tabular data changes", async ({ page }) => {
    const initialTotal = await page.locator(".font-display.text-2xl").textContent();

    await page.locator("tbody tr").first().locator('button').last().click();

    const newTotal = await page.locator(".font-display.text-2xl").textContent();
    expect(newTotal).not.toBe(initialTotal);
  });

  // GOLD 
  test("Gold: App is responsive on mobile viewports", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
  });
});