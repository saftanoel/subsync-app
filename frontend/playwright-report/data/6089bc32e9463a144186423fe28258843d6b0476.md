# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> SubSync SDI Assignment - Silver & Gold >> Silver: Feature 2 - Master to Detail Navigation
- Location: tests/e2e.spec.ts:44:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h2').filter({ hasText: 'No subscriptions yet. Add one!' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('h2').filter({ hasText: 'No subscriptions yet. Add one!' })

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
          - generic [ref=e16]:
            - generic [ref=e17]:
              - generic [ref=e18]: a
              - generic [ref=e19]:
                - paragraph [ref=e20]: admin_user
                - paragraph [ref=e21]: admin
            - button "Logout" [ref=e23] [cursor=pointer]:
              - img
    - generic [ref=e24]:
      - generic [ref=e25]:
        - generic [ref=e27]:
          - img [ref=e29]
          - generic [ref=e31]:
            - paragraph [ref=e32]: Monthly Spend
            - paragraph [ref=e33]: $0.00
        - generic [ref=e35]:
          - img [ref=e37]
          - generic [ref=e39]:
            - paragraph [ref=e40]: Annual Spend
            - paragraph [ref=e41]: $0.00
        - generic [ref=e43]:
          - img [ref=e45]
          - generic [ref=e48]:
            - paragraph [ref=e49]: Avg Rating
            - paragraph [ref=e50]: 0.0 / 5
        - generic [ref=e52]:
          - img [ref=e54]
          - generic [ref=e56]:
            - paragraph [ref=e57]: Active Subs
            - paragraph [ref=e58]: "0"
      - generic [ref=e59]:
        - heading "Your Subscriptions" [level=1] [ref=e60]
        - button "Add Subscription" [ref=e61] [cursor=pointer]:
          - img
          - text: Add Subscription
      - generic [ref=e62]:
        - generic [ref=e64]:
          - generic [ref=e65]:
            - generic [ref=e66]: Infinite Scroll View
            - button "Switch to Pages" [ref=e67] [cursor=pointer]:
              - img
              - text: Switch to Pages
          - table [ref=e69]:
            - rowgroup [ref=e70]:
              - row "Service Cost Cycle Next Payment Rating Actions" [ref=e71]:
                - columnheader "Service" [ref=e72] [cursor=pointer]:
                  - generic [ref=e73]:
                    - text: Service
                    - img [ref=e74]
                - columnheader "Cost" [ref=e77] [cursor=pointer]:
                  - generic [ref=e78]:
                    - text: Cost
                    - img [ref=e79]
                - columnheader "Cycle" [ref=e82] [cursor=pointer]:
                  - generic [ref=e83]:
                    - text: Cycle
                    - img [ref=e84]
                - columnheader "Next Payment" [ref=e87] [cursor=pointer]:
                  - generic [ref=e88]:
                    - text: Next Payment
                    - img [ref=e89]
                - columnheader "Rating" [ref=e92] [cursor=pointer]:
                  - generic [ref=e93]:
                    - text: Rating
                    - img [ref=e94]
                - columnheader "Actions" [ref=e97]
            - rowgroup [ref=e98]:
              - row "No subscriptions yet. Add one!" [ref=e99]:
                - cell "No subscriptions yet. Add one!" [ref=e100]
        - generic [ref=e101]:
          - generic [ref=e102]:
            - generic [ref=e103]:
              - heading "Statistics" [level=3] [ref=e104]
              - paragraph [ref=e105]: Category Breakdown
              - generic [ref=e106]: No data
            - generic [ref=e107]:
              - generic [ref=e109]:
                - heading "Weekly Payment Breakdown" [level=3] [ref=e110]
                - paragraph [ref=e111]: "Total due this week: $0.00"
              - img [ref=e114]:
                - generic [ref=e116]:
                  - generic [ref=e118]: Mon
                  - generic [ref=e120]: Tue
                  - generic [ref=e122]: Wed
                  - generic [ref=e124]: Thu
                  - generic [ref=e126]: Fri
                  - generic [ref=e128]: Sat
                  - generic [ref=e130]: Sun
                - generic [ref=e132]:
                  - generic [ref=e134]: "0"
                  - generic [ref=e136]: "1"
                  - generic [ref=e138]: "2"
                  - generic [ref=e140]: "3"
                  - generic [ref=e142]: "4"
            - heading "Value for Money Rating" [level=3] [ref=e144]
          - generic [ref=e145]:
            - generic [ref=e146]:
              - img [ref=e148]
              - generic [ref=e150]:
                - heading "Security Alerts" [level=3] [ref=e151]
                - paragraph [ref=e152]: Flagged User Activity Observation
            - generic [ref=e155]:
              - generic [ref=e156]:
                - img [ref=e158]
                - generic [ref=e163]:
                  - paragraph [ref=e164]: normal_user
                  - paragraph [ref=e165]: Bulk deletion suspected
              - generic [ref=e166]:
                - img [ref=e167]
                - text: May 21, 2026, 12:32 AM
      - button [ref=e171] [cursor=pointer]:
        - img
  - generic [ref=e172]: "3"
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
> 49 |     await expect(modalTitle).toBeVisible({ timeout: 5000 });
     |                              ^ Error: expect(locator).toBeVisible() failed
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