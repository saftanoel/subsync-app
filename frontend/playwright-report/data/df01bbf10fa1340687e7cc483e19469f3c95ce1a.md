# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> SubSync SDI Assignment - Silver & Gold >> Gold: Charts update automatically when tabular data changes
- Location: tests/e2e.spec.ts:63:3

# Error details

```
Error: locator.click: Test ended.
Call log:
  - waiting for locator('tbody tr').first().locator('button').last()

```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("SubSync SDI Assignment - Silver & Gold", () => {
  4  | 
  5  |   test.beforeEach(async ({ page }) => {
  6  |     page.on('response', response => {
  7  |       if (response.url().includes('login') && response.request().method() === 'POST') {
  8  |         console.log(`[LOGIN RESPONSE] status: ${response.status()}`);
  9  |       }
  10 |     });
  11 | 
  12 |     await page.addInitScript(() => {
  13 |       window.sessionStorage.setItem('skipLoader', 'true');
  14 |     });
  15 | 
  16 |     await page.goto("/login");
  17 |     
  18 |     await page.fill('input[id="username"]', "admin_user");
  19 |     await page.fill('input[id="password"]', "admin123");
  20 |     await page.click('button[type="submit"]', { force: true });
  21 |     
  22 |     await expect(page).toHaveURL(/\/dashboard/);
  23 |   });
  24 | 
  25 |   // --- SILVER ---
  26 |   test("Silver: System monitors user activity using cookies", async ({ page, context }) => {
  27 |     await page.goto("/dashboard");
  28 |     const cookies = await context.cookies();
  29 |     const activityCookie = cookies.find(c => c.name === 'user-activity' || c.name === 'preferences');
  30 |     expect(activityCookie).toBeDefined();
  31 |   });
  32 | 
  33 |   test("Silver: Feature 1 - Add Subscription (CRUD)", async ({ page }) => {
  34 |     // Adăugat force: true pentru mobil
  35 |     await page.click('button:has-text("Add Subscription")', { force: true });
  36 |     await page.fill('input[placeholder="Netflix"]', "Disney Plus");
  37 |     await page.fill('input[placeholder="9.99"]', "13.99");
  38 |     await page.fill('input[type="date"]', "2026-04-15");
  39 |     await page.click('button[type="submit"]:has-text("Add Subscription")', { force: true });
  40 |     
  41 |     await expect(page.locator("td:has-text('Disney Plus')").first()).toBeVisible();
  42 |   });
  43 | 
  44 |   test("Silver: Feature 2 - Master to Detail Navigation", async ({ page }) => {
  45 |     const firstName = await page.locator("tbody tr").first().locator("td").first().textContent();
  46 |     await page.locator("tbody tr").first().click({ force: true });
  47 |     
  48 |     const modalTitle = page.locator("h2").filter({ hasText: firstName || "" });
  49 |     await expect(modalTitle).toBeVisible({ timeout: 5000 });
  50 |   });
  51 | 
  52 |   test("Silver: Feature 3 - Delete Subscription", async ({ page }) => {
  53 |     const firstRow = page.locator("tbody tr").first();
  54 |     const subName = await firstRow.locator("td").first().textContent();
  55 | 
  56 |     // Butonul e la finalul tabelului, pe mobil e greu vizibil. Folosim force.
  57 |     await firstRow.locator('button').last().click({ force: true });
  58 | 
  59 |     await expect(firstRow.locator("td").first()).not.toHaveText(subName || "", { timeout: 5000 });
  60 |   });
  61 | 
  62 |   // --- GOLD ---
  63 |   test("Gold: Charts update automatically when tabular data changes", async ({ page }) => {
  64 |     const initialTotal = await page.locator(".total-amount").textContent();
  65 | 
  66 |     // La fel, force click pe delete
> 67 |     await page.locator("tbody tr").first().locator('button').last().click({ force: true });
     |                                                                     ^ Error: locator.click: Test ended.
  68 | 
  69 |     await page.waitForTimeout(500);
  70 | 
  71 |     const newTotal = await page.locator(".total-amount").textContent();
  72 |     expect(newTotal).not.toBe(initialTotal);
  73 |   });
  74 | 
  75 |   test("Gold: App is responsive on mobile viewports", async ({ page }) => {
  76 |     await page.setViewportSize({ width: 375, height: 667 });
  77 |     await page.goto("/");
  78 |     await expect(page.locator("h1")).toBeVisible();
  79 |   });
  80 | });
```