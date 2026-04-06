# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> SubSync SDI Assignment - Silver & Gold >> Silver: Feature 3 - Delete Subscription [cite: 21]
- Location: tests\e2e.spec.ts:38:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 4
Received: 5
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
          - link "Home" [ref=e11] [cursor=pointer]:
            - /url: /
          - link "Dashboard" [ref=e13] [cursor=pointer]:
            - /url: /dashboard
          - generic [ref=e14]:
            - generic [ref=e15]: Demo User
            - button [ref=e17] [cursor=pointer]:
              - img
    - generic [ref=e18]:
      - generic [ref=e19]:
        - generic [ref=e21]:
          - img [ref=e23]
          - generic [ref=e25]:
            - paragraph [ref=e26]: Monthly Spend
            - paragraph [ref=e27]: $106.80
        - generic [ref=e29]:
          - img [ref=e31]
          - generic [ref=e33]:
            - paragraph [ref=e34]: Annual Spend
            - paragraph [ref=e35]: $1281.60
        - generic [ref=e37]:
          - img [ref=e39]
          - generic [ref=e42]:
            - paragraph [ref=e43]: Avg Rating
            - paragraph [ref=e44]: 3.7 / 5
        - generic [ref=e46]:
          - img [ref=e48]
          - generic [ref=e50]:
            - paragraph [ref=e51]: Active Subs
            - paragraph [ref=e52]: "7"
      - generic [ref=e53]:
        - heading "Your Subscriptions" [level=1] [ref=e54]
        - button "Add Subscription" [ref=e55] [cursor=pointer]:
          - img
          - text: Add Subscription
      - generic [ref=e56]:
        - generic [ref=e58]:
          - table [ref=e60]:
            - rowgroup [ref=e61]:
              - row "Service Cost Cycle Next Payment Rating Actions" [ref=e62]:
                - columnheader "Service" [ref=e63] [cursor=pointer]:
                  - generic [ref=e64]:
                    - text: Service
                    - img [ref=e65]
                - columnheader "Cost" [ref=e68] [cursor=pointer]:
                  - generic [ref=e69]:
                    - text: Cost
                    - img [ref=e70]
                - columnheader "Cycle" [ref=e73] [cursor=pointer]:
                  - generic [ref=e74]:
                    - text: Cycle
                    - img [ref=e75]
                - columnheader "Next Payment" [ref=e78] [cursor=pointer]:
                  - generic [ref=e79]:
                    - text: Next Payment
                    - img [ref=e80]
                - columnheader "Rating" [ref=e83] [cursor=pointer]:
                  - generic [ref=e84]:
                    - text: Rating
                    - img [ref=e85]
                - columnheader "Actions" [ref=e88]
            - rowgroup [ref=e89]:
              - row "Amazon Prime $11.58 Annual 2024-12-12" [ref=e90] [cursor=pointer]:
                - cell "Amazon Prime" [ref=e91]
                - cell "$11.58" [ref=e92]
                - cell "Annual" [ref=e93]
                - cell "2024-12-12" [ref=e94]
                - cell [ref=e95]:
                  - generic [ref=e96]:
                    - img [ref=e97]
                    - img [ref=e99]
                    - img [ref=e101]
                    - img [ref=e103]
                    - img [ref=e105]
                - cell [ref=e107]:
                  - generic [ref=e108]:
                    - button [ref=e109]:
                      - img
                    - button [ref=e110]:
                      - img
              - row "ChatGPT Plus $20.00 Monthly 2024-11-05" [ref=e111] [cursor=pointer]:
                - cell "ChatGPT Plus" [ref=e112]
                - cell "$20.00" [ref=e113]
                - cell "Monthly" [ref=e114]
                - cell "2024-11-05" [ref=e115]
                - cell [ref=e116]:
                  - generic [ref=e117]:
                    - img [ref=e118]
                    - img [ref=e120]
                    - img [ref=e122]
                    - img [ref=e124]
                    - img [ref=e126]
                - cell [ref=e128]:
                  - generic [ref=e129]:
                    - button [ref=e130]:
                      - img
                    - button [ref=e131]:
                      - img
              - row "Gym Membership $35.00 Monthly 2024-11-01" [ref=e132] [cursor=pointer]:
                - cell "Gym Membership" [ref=e133]
                - cell "$35.00" [ref=e134]
                - cell "Monthly" [ref=e135]
                - cell "2024-11-01" [ref=e136]
                - cell [ref=e137]:
                  - generic [ref=e138]:
                    - img [ref=e139]
                    - img [ref=e141]
                    - img [ref=e143]
                    - img [ref=e145]
                    - img [ref=e147]
                - cell [ref=e149]:
                  - generic [ref=e150]:
                    - button [ref=e151]:
                      - img
                    - button [ref=e152]:
                      - img
              - row "iCloud+ $2.99 Monthly 2024-11-18" [ref=e153] [cursor=pointer]:
                - cell "iCloud+" [ref=e154]
                - cell "$2.99" [ref=e155]
                - cell "Monthly" [ref=e156]
                - cell "2024-11-18" [ref=e157]
                - cell [ref=e158]:
                  - generic [ref=e159]:
                    - img [ref=e160]
                    - img [ref=e162]
                    - img [ref=e164]
                    - img [ref=e166]
                    - img [ref=e168]
                - cell [ref=e170]:
                  - generic [ref=e171]:
                    - button [ref=e172]:
                      - img
                    - button [ref=e173]:
                      - img
              - row "Netflix $15.99 Monthly 2024-11-15" [ref=e174] [cursor=pointer]:
                - cell "Netflix" [ref=e175]
                - cell "$15.99" [ref=e176]
                - cell "Monthly" [ref=e177]
                - cell "2024-11-15" [ref=e178]
                - cell [ref=e179]:
                  - generic [ref=e180]:
                    - img [ref=e181]
                    - img [ref=e183]
                    - img [ref=e185]
                    - img [ref=e187]
                    - img [ref=e189]
                - cell [ref=e191]:
                  - generic [ref=e192]:
                    - button [ref=e193]:
                      - img
                    - button [ref=e194]:
                      - img
          - generic [ref=e195]:
            - generic [ref=e196]: Page 1 of 2
            - generic [ref=e197]:
              - button [disabled]:
                - img
              - button "1" [ref=e198] [cursor=pointer]
              - button "2" [ref=e199] [cursor=pointer]
              - button [ref=e200] [cursor=pointer]:
                - img
        - generic [ref=e202]:
          - generic [ref=e203]:
            - heading "Statistics" [level=3] [ref=e204]
            - paragraph [ref=e205]: Category Breakdown
            - generic [ref=e207]:
              - img [ref=e208]:
                - generic [ref=e210]:
                  - img [ref=e212]
                  - img [ref=e214]
                  - img [ref=e216]
                  - img [ref=e218]
                  - img [ref=e220]
                  - img [ref=e222]
              - list [ref=e224]:
                - listitem [ref=e225]:
                  - img [ref=e226]
                  - text: Entertainment
                - listitem [ref=e228]:
                  - img [ref=e229]
                  - text: Music
                - listitem [ref=e231]:
                  - img [ref=e232]
                  - text: Productivity
                - listitem [ref=e234]:
                  - img [ref=e235]
                  - text: Cloud Storage
                - listitem [ref=e237]:
                  - img [ref=e238]
                  - text: Fitness
                - listitem [ref=e240]:
                  - img [ref=e241]
                  - text: News
          - generic [ref=e243]:
            - generic [ref=e245]:
              - heading "Weekly Payment Breakdown" [level=3] [ref=e246]
              - paragraph [ref=e247]: "Total due this week: $20.26"
            - img [ref=e250]:
              - generic [ref=e252]:
                - generic [ref=e254]: Mon
                - generic [ref=e256]: Tue
                - generic [ref=e258]: Wed
                - generic [ref=e260]: Thu
                - generic [ref=e262]: Fri
                - generic [ref=e264]: Sat
                - generic [ref=e266]: Sun
              - generic [ref=e268]:
                - generic [ref=e270]: "0"
                - generic [ref=e272]: "2"
                - generic [ref=e274]: "4"
                - generic [ref=e276]: "6"
                - generic [ref=e278]: "8"
          - generic [ref=e296]:
            - heading "Value for Money Rating" [level=3] [ref=e297]
            - generic [ref=e298]:
              - generic [ref=e299]:
                - generic [ref=e300]: Netflix · $15.99/mo
                - generic [ref=e301]:
                  - generic [ref=e302]: ★
                  - generic [ref=e303]: ★
                  - generic [ref=e304]: ★
                  - generic [ref=e305]: ★
                  - generic [ref=e306]: ★
              - generic [ref=e307]:
                - generic [ref=e308]: Amazon Prime · $11.58/mo
                - generic [ref=e309]:
                  - generic [ref=e310]: ★
                  - generic [ref=e311]: ★
                  - generic [ref=e312]: ★
                  - generic [ref=e313]: ★
                  - generic [ref=e314]: ★
              - generic [ref=e315]:
                - generic [ref=e316]: Spotify Family · $16.99/mo
                - generic [ref=e317]:
                  - generic [ref=e318]: ★
                  - generic [ref=e319]: ★
                  - generic [ref=e320]: ★
                  - generic [ref=e321]: ★
                  - generic [ref=e322]: ★
              - generic [ref=e323]:
                - generic [ref=e324]: ChatGPT Plus · $20/mo
                - generic [ref=e325]:
                  - generic [ref=e326]: ★
                  - generic [ref=e327]: ★
                  - generic [ref=e328]: ★
                  - generic [ref=e329]: ★
                  - generic [ref=e330]: ★
  - generic [ref=e331]: "6"
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("SubSync SDI Assignment - Silver & Gold", () => {
  4  | 
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await page.goto("/");
  7  |     await page.click('a[href="/login"]');
  8  |     await page.fill('input[id="email"]', "demo@subsync.com");
  9  |     await page.fill('input[id="password"]', "password123");
  10 |     await page.click('button[type="submit"]');
  11 |   });
  12 | 
  13 |   // --- SILVER---
  14 |   test("Silver: System monitors user activity using cookies", async ({ page, context }) => {
  15 |     await page.goto("/dashboard");
  16 |     const cookies = await context.cookies();
  17 |     const activityCookie = cookies.find(c => c.name === 'user-activity' || c.name === 'preferences');
  18 |     expect(activityCookie).toBeDefined();
  19 |   });
  20 | 
  21 |   // --- SILVER ---
  22 |   test("Silver: Feature 1 - Add Subscription (CRUD) [cite: 21]", async ({ page }) => {
  23 |     await page.click('button:has-text("Add Subscription")');
  24 |     await page.fill('input[placeholder="Netflix"]', "Disney Plus");
  25 |     await page.fill('input[placeholder="9.99"]', "13.99");
  26 |     await page.fill('input[type="date"]', "2026-04-15");
  27 |     await page.click('button[type="submit"]:has-text("Add Subscription")');
  28 |     await expect(page.locator("td:has-text('Disney Plus')")).toBeVisible();
  29 |   });
  30 | 
  31 |   test("Silver: Feature 2 - Master to Detail Navigation [cite: 20, 34]", async ({ page }) => {
  32 |     const firstName = await page.locator("tbody tr").first().locator("td").first().textContent();
  33 |     await page.locator("tbody tr").first().click();
  34 |     await expect(page).toHaveURL(/\/subscription\/.*/);
  35 |     await expect(page.locator("h1")).toContainText(firstName || "");
  36 |   });
  37 | 
  38 |   test("Silver: Feature 3 - Delete Subscription [cite: 21]", async ({ page }) => {
  39 |     const rowsBefore = await page.locator("tbody tr").count();
  40 |     await page.locator("tbody tr").first().locator('button').last().click();
  41 |     const rowsAfter = await page.locator("tbody tr").count();
> 42 |     expect(rowsAfter).toBe(rowsBefore - 1);
     |                       ^ Error: expect(received).toBe(expected) // Object.is equality
  43 |   });
  44 | 
  45 |   // --- GOLD  ---
  46 |   test("Gold: Charts update automatically when tabular data changes", async ({ page }) => {
  47 |     const initialTotal = await page.locator(".font-display.text-2xl").textContent();
  48 | 
  49 |     await page.locator("tbody tr").first().locator('button').last().click();
  50 | 
  51 |     const newTotal = await page.locator(".font-display.text-2xl").textContent();
  52 |     expect(newTotal).not.toBe(initialTotal);
  53 |   });
  54 | 
  55 |   // GOLD 
  56 |   test("Gold: App is responsive on mobile viewports", async ({ page }) => {
  57 |     await page.setViewportSize({ width: 375, height: 667 });
  58 |     await page.goto("/");
  59 |     await expect(page.locator("h1")).toBeVisible();
  60 |   });
  61 | });
```