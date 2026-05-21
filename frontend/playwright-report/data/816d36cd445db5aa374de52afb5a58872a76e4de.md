# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> SubSync SDI Assignment - Silver & Gold >> Silver: Feature 3 - Delete Subscription
- Location: tests/e2e.spec.ts:120:3

# Error details

```
Error: expect(locator).not.toHaveText(expected) failed

Locator:  locator('tbody tr').first().locator('td').first()
Expected: not "Amazon Prime"
Received: "Amazon Prime"
Timeout:  5000ms

Call log:
  - Expect "not toHaveText" with timeout 5000ms
  - waiting for locator('tbody tr').first().locator('td').first()
    9 × locator resolved to <td class="px-4 py-3 font-medium">Amazon Prime</td>
      - unexpected value "Amazon Prime"

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
      - generic [ref=e26]:
        - generic [ref=e27]:
          - img [ref=e29]
          - generic [ref=e34]:
            - paragraph [ref=e35]: Data Generator
            - paragraph [ref=e36]: Start to auto-populate the database with fake subscription data.
        - generic [ref=e37]:
          - button "Stop" [disabled]:
            - img
            - text: Stop
          - button "Start" [ref=e38] [cursor=pointer]:
            - img
            - text: Start
      - generic [ref=e39]:
        - generic [ref=e41]:
          - img [ref=e43]
          - generic [ref=e45]:
            - paragraph [ref=e46]: Monthly Spend
            - paragraph [ref=e47]: $100.91
        - generic [ref=e49]:
          - img [ref=e51]
          - generic [ref=e53]:
            - paragraph [ref=e54]: Annual Spend
            - paragraph [ref=e55]: $1210.92
        - generic [ref=e57]:
          - img [ref=e59]
          - generic [ref=e62]:
            - paragraph [ref=e63]: Avg Rating
            - paragraph [ref=e64]: 4.3 / 5
        - generic [ref=e66]:
          - img [ref=e68]
          - generic [ref=e70]:
            - paragraph [ref=e71]: Active Subs
            - paragraph [ref=e72]: "9"
      - generic [ref=e73]:
        - heading "Your Subscriptions" [level=1] [ref=e74]
        - button "Add Subscription" [ref=e75] [cursor=pointer]:
          - img
          - text: Add Subscription
      - generic [ref=e76]:
        - generic [ref=e77]:
          - generic [ref=e78]:
            - generic [ref=e79]:
              - generic [ref=e80]: Infinite Scroll View
              - button "Switch to Pages" [ref=e81] [cursor=pointer]:
                - img
                - text: Switch to Pages
            - table [ref=e83]:
              - rowgroup [ref=e84]:
                - row "Service Cost Cycle Next Payment Rating Actions" [ref=e85]:
                  - columnheader "Service" [ref=e86] [cursor=pointer]:
                    - generic [ref=e87]:
                      - text: Service
                      - img [ref=e88]
                  - columnheader "Cost" [ref=e91] [cursor=pointer]:
                    - generic [ref=e92]:
                      - text: Cost
                      - img [ref=e93]
                  - columnheader "Cycle" [ref=e96] [cursor=pointer]:
                    - generic [ref=e97]:
                      - text: Cycle
                      - img [ref=e98]
                  - columnheader "Next Payment" [ref=e101] [cursor=pointer]:
                    - generic [ref=e102]:
                      - text: Next Payment
                      - img [ref=e103]
                  - columnheader "Rating" [ref=e106] [cursor=pointer]:
                    - generic [ref=e107]:
                      - text: Rating
                      - img [ref=e108]
                  - columnheader "Actions" [ref=e111]
              - rowgroup [ref=e112]:
                - row "Amazon Prime $14.99 Monthly 2026-06-20" [ref=e113] [cursor=pointer]:
                  - cell "Amazon Prime" [ref=e114]
                  - cell "$14.99" [ref=e115]
                  - cell "Monthly" [ref=e116]
                  - cell "2026-06-20" [ref=e117]
                  - cell [ref=e118]:
                    - generic [ref=e119]:
                      - img [ref=e120]
                      - img [ref=e122]
                      - img [ref=e124]
                      - img [ref=e126]
                      - img [ref=e128]
                  - cell [ref=e130]:
                    - generic [ref=e131]:
                      - button [ref=e132]:
                        - img
                      - button [ref=e133]:
                        - img
                - row "iCloud+ $2.99 Monthly 2026-06-15" [ref=e134] [cursor=pointer]:
                  - cell "iCloud+" [ref=e135]
                  - cell "$2.99" [ref=e136]
                  - cell "Monthly" [ref=e137]
                  - cell "2026-06-15" [ref=e138]
                  - cell [ref=e139]:
                    - generic [ref=e140]:
                      - img [ref=e141]
                      - img [ref=e143]
                      - img [ref=e145]
                      - img [ref=e147]
                      - img [ref=e149]
                  - cell [ref=e151]:
                    - generic [ref=e152]:
                      - button [ref=e153]:
                        - img
                      - button [ref=e154]:
                        - img
                - row "iCloud+ $2.99 Monthly 2026-06-15" [ref=e155] [cursor=pointer]:
                  - cell "iCloud+" [ref=e156]
                  - cell "$2.99" [ref=e157]
                  - cell "Monthly" [ref=e158]
                  - cell "2026-06-15" [ref=e159]
                  - cell [ref=e160]:
                    - generic [ref=e161]:
                      - img [ref=e162]
                      - img [ref=e164]
                      - img [ref=e166]
                      - img [ref=e168]
                      - img [ref=e170]
                  - cell [ref=e172]:
                    - generic [ref=e173]:
                      - button [ref=e174]:
                        - img
                      - button [ref=e175]:
                        - img
                - row "Netflix $15.99 Monthly 2026-06-01" [ref=e176] [cursor=pointer]:
                  - cell "Netflix" [ref=e177]
                  - cell "$15.99" [ref=e178]
                  - cell "Monthly" [ref=e179]
                  - cell "2026-06-01" [ref=e180]
                  - cell [ref=e181]:
                    - generic [ref=e182]:
                      - img [ref=e183]
                      - img [ref=e185]
                      - img [ref=e187]
                      - img [ref=e189]
                      - img [ref=e191]
                  - cell [ref=e193]:
                    - generic [ref=e194]:
                      - button [ref=e195]:
                        - img
                      - button [ref=e196]:
                        - img
                - row "Netflix $15.99 Monthly 2026-06-01" [ref=e197] [cursor=pointer]:
                  - cell "Netflix" [ref=e198]
                  - cell "$15.99" [ref=e199]
                  - cell "Monthly" [ref=e200]
                  - cell "2026-06-01" [ref=e201]
                  - cell [ref=e202]:
                    - generic [ref=e203]:
                      - img [ref=e204]
                      - img [ref=e206]
                      - img [ref=e208]
                      - img [ref=e210]
                      - img [ref=e212]
                  - cell [ref=e214]:
                    - generic [ref=e215]:
                      - button [ref=e216]:
                        - img
                      - button [ref=e217]:
                        - img
                - row "Spotify $9.99 Monthly 2026-06-05" [ref=e218] [cursor=pointer]:
                  - cell "Spotify" [ref=e219]
                  - cell "$9.99" [ref=e220]
                  - cell "Monthly" [ref=e221]
                  - cell "2026-06-05" [ref=e222]
                  - cell [ref=e223]:
                    - generic [ref=e224]:
                      - img [ref=e225]
                      - img [ref=e227]
                      - img [ref=e229]
                      - img [ref=e231]
                      - img [ref=e233]
                  - cell [ref=e235]:
                    - generic [ref=e236]:
                      - button [ref=e237]:
                        - img
                      - button [ref=e238]:
                        - img
                - row "Spotify $9.99 Monthly 2026-06-05" [ref=e239] [cursor=pointer]:
                  - cell "Spotify" [ref=e240]
                  - cell "$9.99" [ref=e241]
                  - cell "Monthly" [ref=e242]
                  - cell "2026-06-05" [ref=e243]
                  - cell [ref=e244]:
                    - generic [ref=e245]:
                      - img [ref=e246]
                      - img [ref=e248]
                      - img [ref=e250]
                      - img [ref=e252]
                      - img [ref=e254]
                  - cell [ref=e256]:
                    - generic [ref=e257]:
                      - button [ref=e258]:
                        - img
                      - button [ref=e259]:
                        - img
                - row "YouTube Premium $13.99 Monthly 2026-06-10" [ref=e260] [cursor=pointer]:
                  - cell "YouTube Premium" [ref=e261]
                  - cell "$13.99" [ref=e262]
                  - cell "Monthly" [ref=e263]
                  - cell "2026-06-10" [ref=e264]
                  - cell [ref=e265]:
                    - generic [ref=e266]:
                      - img [ref=e267]
                      - img [ref=e269]
                      - img [ref=e271]
                      - img [ref=e273]
                      - img [ref=e275]
                  - cell [ref=e277]:
                    - generic [ref=e278]:
                      - button [ref=e279]:
                        - img
                      - button [ref=e280]:
                        - img
                - row "YouTube Premium $13.99 Monthly 2026-06-10" [ref=e281] [cursor=pointer]:
                  - cell "YouTube Premium" [ref=e282]
                  - cell "$13.99" [ref=e283]
                  - cell "Monthly" [ref=e284]
                  - cell "2026-06-10" [ref=e285]
                  - cell [ref=e286]:
                    - generic [ref=e287]:
                      - img [ref=e288]
                      - img [ref=e290]
                      - img [ref=e292]
                      - img [ref=e294]
                      - img [ref=e296]
                  - cell [ref=e298]:
                    - generic [ref=e299]:
                      - button [ref=e300]:
                        - img
                      - button [ref=e301]:
                        - img
          - button "Încarcă următoarea pagină" [ref=e302] [cursor=pointer]
        - generic [ref=e303]:
          - generic [ref=e304]:
            - generic [ref=e305]:
              - heading "Statistics" [level=3] [ref=e306]
              - paragraph [ref=e307]: Category Breakdown
              - generic [ref=e309]:
                - img [ref=e310]:
                  - generic [ref=e312]:
                    - img [ref=e314]
                    - img [ref=e316]
                    - img [ref=e318]
                - list [ref=e320]:
                  - listitem [ref=e321]:
                    - img [ref=e322]
                    - text: Entertainment
                  - listitem [ref=e324]:
                    - img [ref=e325]
                    - text: Music
                  - listitem [ref=e327]:
                    - img [ref=e328]
                    - text: Cloud Storage
            - generic [ref=e330]:
              - generic [ref=e332]:
                - heading "Weekly Payment Breakdown" [level=3] [ref=e333]
                - paragraph [ref=e334]: "Total due this week: $19.14"
              - img [ref=e337]:
                - generic [ref=e339]:
                  - generic [ref=e341]: Mon
                  - generic [ref=e343]: Tue
                  - generic [ref=e345]: Wed
                  - generic [ref=e347]: Thu
                  - generic [ref=e349]: Fri
                  - generic [ref=e351]: Sat
                  - generic [ref=e353]: Sun
                - generic [ref=e355]:
                  - generic [ref=e357]: "0"
                  - generic [ref=e359]: "2"
                  - generic [ref=e361]: "4"
                  - generic [ref=e363]: "6"
                  - generic [ref=e365]: "8"
            - generic [ref=e383]:
              - heading "Value for Money Rating" [level=3] [ref=e384]
              - generic [ref=e385]:
                - generic [ref=e386]:
                  - generic [ref=e387]: Netflix · $15.99/mo
                  - generic [ref=e388]:
                    - generic [ref=e389]: ★
                    - generic [ref=e390]: ★
                    - generic [ref=e391]: ★
                    - generic [ref=e392]: ★
                    - generic [ref=e393]: ★
                - generic [ref=e394]:
                  - generic [ref=e395]: Netflix · $15.99/mo
                  - generic [ref=e396]:
                    - generic [ref=e397]: ★
                    - generic [ref=e398]: ★
                    - generic [ref=e399]: ★
                    - generic [ref=e400]: ★
                    - generic [ref=e401]: ★
                - generic [ref=e402]:
                  - generic [ref=e403]: Spotify · $9.99/mo
                  - generic [ref=e404]:
                    - generic [ref=e405]: ★
                    - generic [ref=e406]: ★
                    - generic [ref=e407]: ★
                    - generic [ref=e408]: ★
                    - generic [ref=e409]: ★
                - generic [ref=e410]:
                  - generic [ref=e411]: Spotify · $9.99/mo
                  - generic [ref=e412]:
                    - generic [ref=e413]: ★
                    - generic [ref=e414]: ★
                    - generic [ref=e415]: ★
                    - generic [ref=e416]: ★
                    - generic [ref=e417]: ★
          - generic [ref=e418]:
            - generic [ref=e419]:
              - img [ref=e421]
              - generic [ref=e423]:
                - heading "Security Alerts" [level=3] [ref=e424]
                - paragraph [ref=e425]: Flagged User Activity Observation
            - generic [ref=e427]:
              - generic [ref=e428]:
                - generic [ref=e429]:
                  - img [ref=e431]
                  - generic [ref=e436]:
                    - paragraph [ref=e437]: admin_user
                    - paragraph [ref=e438]: Bulk deletion suspected
                - generic [ref=e439]:
                  - img [ref=e440]
                  - text: May 21, 2026, 7:11 PM
              - generic [ref=e443]:
                - generic [ref=e444]:
                  - img [ref=e446]
                  - generic [ref=e451]:
                    - paragraph [ref=e452]: normal_user
                    - paragraph [ref=e453]: Bulk deletion suspected
                - generic [ref=e454]:
                  - img [ref=e455]
                  - text: May 21, 2026, 7:08 PM
      - button [ref=e459] [cursor=pointer]:
        - img
  - generic [ref=e460]: "6"
```

# Test source

```ts
  27  |       const getRes = await request.get(`http://localhost:8000/subscriptions`);
  28  |       if (getRes.ok()) {
  29  |         const subs = await getRes.json();
  30  |         for (const sub of subs) {
  31  |           await request.delete(`http://localhost:8000/subscriptions/${sub.id}?username=admin_user`);
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
> 127 |     await expect(firstRow.locator("td").first()).not.toHaveText(subName || "", { timeout: 5000 });
      |                                                      ^ Error: expect(locator).not.toHaveText(expected) failed
  128 |   });
  129 | 
  130 |   // --- GOLD ---
  131 |   test("Gold: Charts update automatically when tabular data changes", async ({ page }) => {
  132 |     const initialTotal = await page.locator(".total-amount").textContent();
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