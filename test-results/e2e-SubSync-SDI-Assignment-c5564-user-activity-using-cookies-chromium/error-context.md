# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> SubSync SDI Assignment - Silver & Gold >> Silver: System monitors user activity using cookies
- Location: tests\e2e.spec.ts:15:3

# Error details

```
Error: expect(received).toBeDefined()

Received: undefined
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications (F8)":
    - list
  - region "Notifications alt+T"
  - generic [ref=e4]:
    - img "SubSync logo" [ref=e6]
    - generic [ref=e7]:
      - heading "SubSync" [level=1] [ref=e8]
      - paragraph [ref=e9]: Syncing your data...
  - navigation [ref=e10]:
    - generic [ref=e11]:
      - link "SubSync Logo SubSync" [ref=e13] [cursor=pointer]:
        - /url: /
        - img "SubSync Logo" [ref=e14]
        - generic [ref=e15]: SubSync
      - generic [ref=e16]:
        - button "Toggle theme" [ref=e17] [cursor=pointer]:
          - img
          - generic [ref=e18]: Toggle theme
        - link "Home" [ref=e20] [cursor=pointer]:
          - /url: /
        - link "Login" [ref=e22] [cursor=pointer]:
          - /url: /login
        - link "Sign Up" [ref=e24] [cursor=pointer]:
          - /url: /register
          - button "Sign Up" [ref=e25]
  - generic [ref=e27]:
    - generic [ref=e28]:
      - img [ref=e30]
      - heading "Welcome back" [level=1] [ref=e32]
      - paragraph [ref=e33]: Sign in to SubSync
    - generic [ref=e34]:
      - generic [ref=e35]:
        - text: Email
        - textbox "Email" [ref=e36]:
          - /placeholder: demo@subsync.com
      - generic [ref=e37]:
        - text: Password
        - textbox "Password" [ref=e38]:
          - /placeholder: ••••••••
      - button "Login" [ref=e39] [cursor=pointer]
    - paragraph [ref=e40]:
      - text: Don't have an account?
      - link "Register" [ref=e41] [cursor=pointer]:
        - /url: /register
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
  9  |     await page.fill('input[id="email"]', "demo@subsync.com");
  10 |     await page.fill('input[id="password"]', "password123");
  11 |     await page.click('button[type="submit"]', { force: true });
  12 |   });
  13 | 
  14 |   // --- SILVER ---
  15 |   test("Silver: System monitors user activity using cookies", async ({ page, context }) => {
  16 |     await page.goto("/dashboard");
  17 |     const cookies = await context.cookies();
  18 |     const activityCookie = cookies.find(c => c.name === 'user-activity' || c.name === 'preferences');
> 19 |     expect(activityCookie).toBeDefined();
     |                            ^ Error: expect(received).toBeDefined()
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