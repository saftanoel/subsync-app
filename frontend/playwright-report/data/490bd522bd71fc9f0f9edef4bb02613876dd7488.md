# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> SubSync SDI Assignment - Silver & Gold >> Silver: Feature 3 - Delete Subscription
- Location: tests/e2e.spec.ts:52:3

# Error details

```
Error: expect(locator).not.toHaveText(expected) failed

Locator:  locator('tbody tr').first().locator('td').first()
Expected: not "Disney Plus"
Received: "Disney Plus"
Timeout:  5000ms

Call log:
  - Expect "not toHaveText" with timeout 5000ms
  - waiting for locator('tbody tr').first().locator('td').first()
    9 × locator resolved to <td class="px-4 py-3 font-medium">Disney Plus</td>
      - unexpected value "Disney Plus"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
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
          - link "Dashboard" [ref=e15] [cursor=pointer]:
            - /url: /dashboard
          - button "Logout" [ref=e18] [cursor=pointer]:
            - img
    - generic [ref=e19]:
      - generic [ref=e20]:
        - generic [ref=e22]:
          - img [ref=e24]
          - generic [ref=e26]:
            - paragraph [ref=e27]: Monthly Spend
            - paragraph [ref=e28]: $13.99
        - generic [ref=e30]:
          - img [ref=e32]
          - generic [ref=e34]:
            - paragraph [ref=e35]: Annual Spend
            - paragraph [ref=e36]: $167.88
        - generic [ref=e38]:
          - img [ref=e40]
          - generic [ref=e43]:
            - paragraph [ref=e44]: Avg Rating
            - paragraph [ref=e45]: 3.0 / 5
        - generic [ref=e47]:
          - img [ref=e49]
          - generic [ref=e51]:
            - paragraph [ref=e52]: Active Subs
            - paragraph [ref=e53]: "1"
      - generic [ref=e54]:
        - heading "Your Subscriptions" [level=1] [ref=e55]
        - button "Add Subscription" [ref=e56] [cursor=pointer]:
          - img
          - text: Add Subscription
      - generic [ref=e57]:
        - generic [ref=e58]:
          - generic [ref=e59]:
            - generic [ref=e60]:
              - generic [ref=e61]: Infinite Scroll View
              - button "Switch to Pages" [ref=e62] [cursor=pointer]:
                - img
                - text: Switch to Pages
            - table [ref=e64]:
              - rowgroup [ref=e65]:
                - row "Service Cost Cycle Next Payment Rating Actions" [ref=e66]:
                  - columnheader "Service" [ref=e67] [cursor=pointer]:
                    - generic [ref=e68]:
                      - text: Service
                      - img [ref=e69]
                  - columnheader "Cost" [ref=e72] [cursor=pointer]:
                    - generic [ref=e73]:
                      - text: Cost
                      - img [ref=e74]
                  - columnheader "Cycle" [ref=e77] [cursor=pointer]:
                    - generic [ref=e78]:
                      - text: Cycle
                      - img [ref=e79]
                  - columnheader "Next Payment" [ref=e82] [cursor=pointer]:
                    - generic [ref=e83]:
                      - text: Next Payment
                      - img [ref=e84]
                  - columnheader "Rating" [ref=e87] [cursor=pointer]:
                    - generic [ref=e88]:
                      - text: Rating
                      - img [ref=e89]
                  - columnheader "Actions" [ref=e92]
              - rowgroup [ref=e93]:
                - row "Disney Plus $13.99 Monthly 2026-04-15" [ref=e94] [cursor=pointer]:
                  - cell "Disney Plus" [ref=e95]
                  - cell "$13.99" [ref=e96]
                  - cell "Monthly" [ref=e97]
                  - cell "2026-04-15" [ref=e98]
                  - cell [ref=e99]:
                    - generic [ref=e100]:
                      - img [ref=e101]
                      - img [ref=e103]
                      - img [ref=e105]
                      - img [ref=e107]
                      - img [ref=e109]
                  - cell [ref=e111]:
                    - generic [ref=e112]:
                      - button [ref=e113]:
                        - img
                      - button [ref=e114]:
                        - img
          - paragraph [ref=e115]: Ai ajuns la finalul bazei de date. Toate datele sunt afișate.
        - generic [ref=e116]:
          - generic [ref=e117]:
            - generic [ref=e118]:
              - heading "Statistics" [level=3] [ref=e119]
              - paragraph [ref=e120]: Category Breakdown
              - generic [ref=e122]:
                - img [ref=e123]:
                  - img [ref=e127]
                - list [ref=e129]:
                  - listitem [ref=e130]:
                    - img [ref=e131]
                    - text: Entertainment
            - generic [ref=e133]:
              - generic [ref=e135]:
                - heading "Weekly Payment Breakdown" [level=3] [ref=e136]
                - paragraph [ref=e137]: "Total due this week: $2.66"
              - img [ref=e140]:
                - generic [ref=e142]:
                  - generic [ref=e144]: Mon
                  - generic [ref=e146]: Tue
                  - generic [ref=e148]: Wed
                  - generic [ref=e150]: Thu
                  - generic [ref=e152]: Fri
                  - generic [ref=e154]: Sat
                  - generic [ref=e156]: Sun
                - generic [ref=e158]:
                  - generic [ref=e160]: "0"
                  - generic [ref=e162]: "0.2"
                  - generic [ref=e164]: "0.4"
                  - generic [ref=e166]: "0.6"
                  - generic [ref=e168]: "0.8"
            - generic [ref=e186]:
              - heading "Value for Money Rating" [level=3] [ref=e187]
              - generic [ref=e189]:
                - generic [ref=e190]: Disney Plus · $13.99/mo
                - generic [ref=e191]:
                  - generic [ref=e192]: ★
                  - generic [ref=e193]: ★
                  - generic [ref=e194]: ★
                  - generic [ref=e195]: ★
                  - generic [ref=e196]: ★
          - generic [ref=e197]:
            - generic [ref=e198]:
              - img [ref=e200]
              - generic [ref=e202]:
                - heading "Security Alerts" [level=3] [ref=e203]
                - paragraph [ref=e204]: Flagged User Activity Observation
            - generic [ref=e207]:
              - generic [ref=e208]:
                - img [ref=e210]
                - generic [ref=e215]:
                  - paragraph [ref=e216]: normal_user
                  - paragraph [ref=e217]: Bulk deletion suspected
              - generic [ref=e218]:
                - img [ref=e219]
                - text: May 21, 2026, 12:32 AM
      - button [ref=e223] [cursor=pointer]:
        - img
  - generic [ref=e224]: "0.8"
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
> 59 |     await expect(firstRow.locator("td").first()).not.toHaveText(subName || "", { timeout: 5000 });
     |                                                      ^ Error: expect(locator).not.toHaveText(expected) failed
  60 |   });
  61 | 
  62 |   // --- GOLD ---
  63 |   test("Gold: Charts update automatically when tabular data changes", async ({ page }) => {
  64 |     const initialTotal = await page.locator(".total-amount").textContent();
  65 | 
  66 |     // La fel, force click pe delete
  67 |     await page.locator("tbody tr").first().locator('button').last().click({ force: true });
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