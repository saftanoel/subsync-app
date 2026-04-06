# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> SubSync SDI Assignment - Silver & Gold >> Silver: Feature 1 - Add Subscription (CRUD)
- Location: tests\e2e.spec.ts:22:3

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[id="email"]')

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications (F8)":
    - list
  - region "Notifications alt+T"
  - navigation [ref=e3]:
    - generic [ref=e4]:
      - link "SubSync Logo SubSync" [ref=e6] [cursor=pointer]:
        - /url: /
        - img "SubSync Logo" [ref=e7]
        - generic [ref=e8]: SubSync
      - generic [ref=e9]:
        - button "Toggle theme" [ref=e10] [cursor=pointer]:
          - img
          - generic [ref=e11]: Toggle theme
        - link "Home" [ref=e13] [cursor=pointer]:
          - /url: /
        - link "Login" [ref=e15] [cursor=pointer]:
          - /url: /login
        - link "Sign Up" [ref=e17] [cursor=pointer]:
          - /url: /register
          - button "Sign Up" [ref=e18]
  - generic [ref=e20]:
    - generic [ref=e21]:
      - generic [ref=e22]:
        - heading "Stop bleeding money. Start syncing." [level=1] [ref=e23]:
          - text: Stop bleeding money.
          - text: Start syncing.
        - paragraph [ref=e24]: Easily track and manage all your subscriptions in one place. See your total spend, get renewal reminders, and find subscriptions worth cutting.
      - generic [ref=e25]:
        - link "Get Started" [ref=e27] [cursor=pointer]:
          - /url: /register
          - button "Get Started" [ref=e28]:
            - text: Get Started
            - img
        - link "Learn More" [ref=e30] [cursor=pointer]:
          - /url: /login
          - button "Learn More" [ref=e31]
      - generic [ref=e33]:
        - generic [ref=e34]:
          - generic [ref=e35]: Your subscriptions
          - generic [ref=e36]: Total monthly spend
        - generic [ref=e37]:
          - generic [ref=e38]:
            - generic [ref=e39]: Netflix
            - generic [ref=e40]:
              - generic [ref=e41]: $15.99
              - generic [ref=e42]: Monthly
          - generic [ref=e43]:
            - generic [ref=e44]: Spotify
            - generic [ref=e45]:
              - generic [ref=e46]: $16.99
              - generic [ref=e47]: Monthly
          - generic [ref=e48]:
            - generic [ref=e49]: iCloud+
            - generic [ref=e50]:
              - generic [ref=e51]: $2.99
              - generic [ref=e52]: Monthly
        - generic [ref=e53]: $35.97/mo
    - generic [ref=e55]:
      - generic [ref=e56] [cursor=pointer]:
        - img [ref=e58]
        - heading "Track Spending" [level=3] [ref=e61]
        - paragraph [ref=e62]: See exactly where your money goes each month.
      - generic [ref=e63] [cursor=pointer]:
        - img [ref=e65]
        - heading "Visual Insights" [level=3] [ref=e68]
        - paragraph [ref=e69]: Beautiful charts that update in real-time.
      - generic [ref=e70] [cursor=pointer]:
        - img [ref=e72]
        - heading "Smart Savings" [level=3] [ref=e74]
        - paragraph [ref=e75]: ROI projections show what you'd save by cutting.
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("SubSync SDI Assignment - Silver & Gold", () => {
  4  | 
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await page.goto("/");
  7  |     // Folosim force: true pentru a ignora eventualele suprapuneri vizuale (în special pe mobil)
  8  |     await page.click('a[href="/login"]', { force: true });
> 9  |     await page.fill('input[id="email"]', "demo@subsync.com");
     |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
  10 |     await page.fill('input[id="password"]', "password123");
  11 |     await page.click('button[type="submit"]', { force: true });
  12 |   });
  13 | 
  14 |   // --- SILVER ---
  15 |   test("Silver: System monitors user activity using cookies", async ({ page, context }) => {
  16 |     await page.goto("/dashboard");
  17 |     const cookies = await context.cookies();
  18 |     const activityCookie = cookies.find(c => c.name === 'user-activity' || c.name === 'preferences');
  19 |     expect(activityCookie).toBeDefined();
  20 |   });
  21 | 
  22 |   test("Silver: Feature 1 - Add Subscription (CRUD)", async ({ page }) => {
  23 |     await page.click('button:has-text("Add Subscription")', { force: true });
  24 |     await page.fill('input[placeholder="Netflix"]', "Disney Plus");
  25 |     await page.fill('input[placeholder="9.99"]', "13.99");
  26 |     await page.fill('input[type="date"]', "2026-04-15");
  27 |     await page.click('button[type="submit"]:has-text("Add Subscription")', { force: true });
  28 |     await expect(page.locator("td:has-text('Disney Plus')").first()).toBeVisible();
  29 |   });
  30 | 
  31 |   test("Silver: Feature 2 - Master to Detail Navigation", async ({ page }) => {
  32 |     const firstName = await page.locator("tbody tr").first().locator("td").first().textContent();
  33 |     await page.locator("tbody tr").first().click({ force: true });
  34 |     const modalTitle = page.locator("h2").filter({ hasText: firstName || "" });
  35 |     await expect(modalTitle).toBeVisible({ timeout: 5000 });
  36 |   });
  37 | 
  38 |   test("Silver: Feature 3 - Delete Subscription", async ({ page }) => {
  39 |     // 1. Salvăm numele primei subscripții
  40 |     const firstRow = page.locator("tbody tr").first();
  41 |     const subName = await firstRow.locator("td").first().textContent();
  42 | 
  43 |     // 2. Apăsăm butonul de delete
  44 |     await firstRow.locator('button').last().click({ force: true });
  45 | 
  46 |     // 3. Verificăm că prima linie nu mai are vechiul nume (a fost ștearsă)
  47 |     // Asta merge perfect chiar dacă tabelul aduce un alt rând de pe pagina 2!
  48 |     await expect(firstRow.locator("td").first()).not.toHaveText(subName || "", { timeout: 5000 });
  49 |   });
  50 | 
  51 |   // --- GOLD ---
  52 |   test("Gold: Charts update automatically when tabular data changes", async ({ page }) => {
  53 |     const initialTotal = await page.locator(".total-amount").textContent();
  54 | 
  55 |     // Ștergem un rând cu force:true
  56 |     await page.locator("tbody tr").first().locator('button').last().click({ force: true });
  57 | 
  58 |     // Așteptăm ca prețul să se recalculeze în background
  59 |     await page.waitForTimeout(500);
  60 | 
  61 |     const newTotal = await page.locator(".total-amount").textContent();
  62 |     expect(newTotal).not.toBe(initialTotal);
  63 |   });
  64 | 
  65 |   test("Gold: App is responsive on mobile viewports", async ({ page }) => {
  66 |     await page.setViewportSize({ width: 375, height: 667 });
  67 |     await page.goto("/");
  68 |     await expect(page.locator("h1")).toBeVisible();
  69 |   });
  70 | });
```