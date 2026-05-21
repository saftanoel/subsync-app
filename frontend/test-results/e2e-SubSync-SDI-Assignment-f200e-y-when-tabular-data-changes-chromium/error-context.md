# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> SubSync SDI Assignment - Silver & Gold >> Gold: Charts update automatically when tabular data changes
- Location: tests/e2e.spec.ts:131:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.textContent: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.total-amount')

```

# Test source

```ts
  32  |         }
  33  |       }
  34  |     } catch (e) {
  35  |       // Silently ignore
  36  |     }
  37  | 
  38  |     const subsToSeed = [
  39  |       { serviceName: "Netflix", category: "Entertainment", monthlyCost: 15.99, billingCycle: "Monthly", nextPayment: "2026-06-01", valueRating: 5 },
  40  |       { serviceName: "Spotify", category: "Music", monthlyCost: 9.99, billingCycle: "Monthly", nextPayment: "2026-06-05", valueRating: 4 },
  41  |       { serviceName: "YouTube Premium", category: "Entertainment", monthlyCost: 13.99, billingCycle: "Monthly", nextPayment: "2026-06-10", valueRating: 5 },
  42  |       { serviceName: "iCloud+", category: "Cloud Storage", monthlyCost: 2.99, billingCycle: "Monthly", nextPayment: "2026-06-15", valueRating: 4 },
  43  |       { serviceName: "Amazon Prime", category: "Entertainment", monthlyCost: 14.99, billingCycle: "Monthly", nextPayment: "2026-06-20", valueRating: 3 },
  44  |     ];
  45  | 
  46  |     for (const sub of subsToSeed) {
  47  |       try {
  48  |         await request.post(`${apiBase}/subscriptions`, {
  49  |           data: sub,
  50  |           headers: { "ngrok-skip-browser-warning": "69420" }
  51  |         });
  52  |       } catch (e) {
  53  |         // Silently ignore or fallback
  54  |       }
  55  |       try {
  56  |         await request.post(`http://localhost:8000/subscriptions`, {
  57  |           data: sub
  58  |         });
  59  |       } catch (e) {
  60  |         // Silently ignore
  61  |       }
  62  |     }
  63  |   });
  64  | 
  65  |   test.beforeEach(async ({ page }) => {
  66  |     page.on('console', msg => {
  67  |       console.log(`[BROWSER LOG] [${msg.type()}] ${msg.text()}`);
  68  |     });
  69  | 
  70  |     page.on('pageerror', err => {
  71  |       console.log(`[BROWSER UNCAUGHT ERROR] ${err.message}`);
  72  |     });
  73  | 
  74  |     page.on('response', response => {
  75  |       if (response.url().includes('login') && response.request().method() === 'POST') {
  76  |         console.log(`[LOGIN RESPONSE] status: ${response.status()}`);
  77  |       }
  78  |     });
  79  | 
  80  |     await page.addInitScript(() => {
  81  |       window.sessionStorage.setItem('skipLoader', 'true');
  82  |     });
  83  | 
  84  |     await page.goto("/login");
  85  |     
  86  |     await page.fill('input[id="username"]', "admin_user");
  87  |     await page.fill('input[id="password"]', "admin123");
  88  |     await page.click('button[type="submit"]', { force: true });
  89  |     
  90  |     await expect(page).toHaveURL(/\/dashboard/);
  91  |   });
  92  | 
  93  |   // --- SILVER ---
  94  |   test("Silver: System monitors user activity using cookies", async ({ page, context }) => {
  95  |     await page.goto("/dashboard");
  96  |     const cookies = await context.cookies();
  97  |     const activityCookie = cookies.find(c => c.name === 'user-activity' || c.name === 'preferences');
  98  |     expect(activityCookie).toBeDefined();
  99  |   });
  100 | 
  101 |   test("Silver: Feature 1 - Add Subscription (CRUD)", async ({ page }) => {
  102 |     // Adăugat force: true pentru mobil
  103 |     await page.click('button:has-text("Add Subscription")', { force: true });
  104 |     await page.fill('input[placeholder="Netflix"]', "Disney Plus");
  105 |     await page.fill('input[placeholder="9.99"]', "13.99");
  106 |     await page.fill('input[type="date"]', "2026-04-15");
  107 |     await page.click('button[type="submit"]:has-text("Add Subscription")', { force: true });
  108 |     
  109 |     await expect(page.locator("td:has-text('Disney Plus')").first()).toBeVisible();
  110 |   });
  111 | 
  112 |   test("Silver: Feature 2 - Master to Detail Navigation", async ({ page }) => {
  113 |     const firstName = await page.locator("tbody tr").first().locator("td").first().textContent();
  114 |     await page.locator("tbody tr").first().click({ force: true });
  115 |     
  116 |     const modalTitle = page.locator("h2").filter({ hasText: firstName || "" });
  117 |     await expect(modalTitle).toBeVisible({ timeout: 5000 });
  118 |   });
  119 | 
  120 |   test("Silver: Feature 3 - Delete Subscription", async ({ page }) => {
  121 |     const firstRow = page.locator("tbody tr").first();
  122 |     const subName = await firstRow.locator("td").first().textContent();
  123 | 
  124 |     // Butonul e la finalul tabelului, pe mobil e greu vizibil. Folosim force.
  125 |     await firstRow.locator('button').last().click({ force: true });
  126 | 
  127 |     await expect(firstRow.locator("td").first()).not.toHaveText(subName || "", { timeout: 5000 });
  128 |   });
  129 | 
  130 |   // --- GOLD ---
  131 |   test("Gold: Charts update automatically when tabular data changes", async ({ page }) => {
> 132 |     const initialTotal = await page.locator(".total-amount").textContent();
      |                                                              ^ Error: locator.textContent: Test timeout of 30000ms exceeded.
  133 | 
  134 |     // La fel, force click pe delete
  135 |     await page.locator("tbody tr").first().locator('button').last().click({ force: true });
  136 | 
  137 |     await page.waitForTimeout(500);
  138 | 
  139 |     const newTotal = await page.locator(".total-amount").textContent();
  140 |     expect(newTotal).not.toBe(initialTotal);
  141 |   });
  142 | 
  143 |   test("Gold: App is responsive on mobile viewports", async ({ page }) => {
  144 |     await page.setViewportSize({ width: 375, height: 667 });
  145 |     await page.goto("/");
  146 |     await expect(page.locator("h1")).toBeVisible();
  147 |   });
  148 | });
```