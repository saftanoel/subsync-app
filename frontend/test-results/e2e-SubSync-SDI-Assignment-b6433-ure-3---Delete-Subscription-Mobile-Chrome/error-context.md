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
          - button "Logout" [ref=e18] [cursor=pointer]:
            - img
    - generic [ref=e19]:
      - generic [ref=e21]:
        - generic [ref=e22]:
          - img [ref=e24]
          - generic [ref=e29]:
            - paragraph [ref=e30]: Data Generator
            - paragraph [ref=e31]: Start to auto-populate the database with fake subscription data.
        - generic [ref=e32]:
          - button "Stop" [disabled]:
            - img
            - text: Stop
          - button "Start" [ref=e33] [cursor=pointer]:
            - img
            - text: Start
      - generic [ref=e34]:
        - generic [ref=e36]:
          - img [ref=e38]
          - generic [ref=e40]:
            - paragraph [ref=e41]: Monthly Spend
            - paragraph [ref=e42]: $100.91
        - generic [ref=e44]:
          - img [ref=e46]
          - generic [ref=e48]:
            - paragraph [ref=e49]: Annual Spend
            - paragraph [ref=e50]: $1210.92
        - generic [ref=e52]:
          - img [ref=e54]
          - generic [ref=e57]:
            - paragraph [ref=e58]: Avg Rating
            - paragraph [ref=e59]: 4.3 / 5
        - generic [ref=e61]:
          - img [ref=e63]
          - generic [ref=e65]:
            - paragraph [ref=e66]: Active Subs
            - paragraph [ref=e67]: "9"
      - generic [ref=e68]:
        - heading "Your Subscriptions" [level=1] [ref=e69]
        - button "Add Subscription" [ref=e70] [cursor=pointer]:
          - img
          - text: Add Subscription
      - generic [ref=e71]:
        - generic [ref=e72]:
          - generic [ref=e73]:
            - generic [ref=e74]:
              - generic [ref=e75]: Infinite Scroll View
              - button "Switch to Pages" [ref=e76] [cursor=pointer]:
                - img
                - text: Switch to Pages
            - table [ref=e78]:
              - rowgroup [ref=e79]:
                - row "Service Cost Cycle Next Payment Rating Actions" [ref=e80]:
                  - columnheader "Service" [ref=e81] [cursor=pointer]:
                    - generic [ref=e82]:
                      - text: Service
                      - img [ref=e83]
                  - columnheader "Cost" [ref=e86] [cursor=pointer]:
                    - generic [ref=e87]:
                      - text: Cost
                      - img [ref=e88]
                  - columnheader "Cycle" [ref=e91] [cursor=pointer]:
                    - generic [ref=e92]:
                      - text: Cycle
                      - img [ref=e93]
                  - columnheader "Next Payment" [ref=e96] [cursor=pointer]:
                    - generic [ref=e97]:
                      - text: Next Payment
                      - img [ref=e98]
                  - columnheader "Rating" [ref=e101] [cursor=pointer]:
                    - generic [ref=e102]:
                      - text: Rating
                      - img [ref=e103]
                  - columnheader "Actions" [ref=e106]
              - rowgroup [ref=e107]:
                - row "Amazon Prime $14.99 Monthly 2026-06-20" [ref=e108] [cursor=pointer]:
                  - cell "Amazon Prime" [ref=e109]
                  - cell "$14.99" [ref=e110]
                  - cell "Monthly" [ref=e111]
                  - cell "2026-06-20" [ref=e112]
                  - cell [ref=e113]:
                    - generic [ref=e114]:
                      - img [ref=e115]
                      - img [ref=e117]
                      - img [ref=e119]
                      - img [ref=e121]
                      - img [ref=e123]
                  - cell [ref=e125]:
                    - generic [ref=e126]:
                      - button [ref=e127]:
                        - img
                      - button [ref=e128]:
                        - img
                - row "iCloud+ $2.99 Monthly 2026-06-15" [ref=e129] [cursor=pointer]:
                  - cell "iCloud+" [ref=e130]
                  - cell "$2.99" [ref=e131]
                  - cell "Monthly" [ref=e132]
                  - cell "2026-06-15" [ref=e133]
                  - cell [ref=e134]:
                    - generic [ref=e135]:
                      - img [ref=e136]
                      - img [ref=e138]
                      - img [ref=e140]
                      - img [ref=e142]
                      - img [ref=e144]
                  - cell [ref=e146]:
                    - generic [ref=e147]:
                      - button [ref=e148]:
                        - img
                      - button [ref=e149]:
                        - img
                - row "iCloud+ $2.99 Monthly 2026-06-15" [ref=e150] [cursor=pointer]:
                  - cell "iCloud+" [ref=e151]
                  - cell "$2.99" [ref=e152]
                  - cell "Monthly" [ref=e153]
                  - cell "2026-06-15" [ref=e154]
                  - cell [ref=e155]:
                    - generic [ref=e156]:
                      - img [ref=e157]
                      - img [ref=e159]
                      - img [ref=e161]
                      - img [ref=e163]
                      - img [ref=e165]
                  - cell [ref=e167]:
                    - generic [ref=e168]:
                      - button [ref=e169]:
                        - img
                      - button [ref=e170]:
                        - img
                - row "Netflix $15.99 Monthly 2026-06-01" [ref=e171] [cursor=pointer]:
                  - cell "Netflix" [ref=e172]
                  - cell "$15.99" [ref=e173]
                  - cell "Monthly" [ref=e174]
                  - cell "2026-06-01" [ref=e175]
                  - cell [ref=e176]:
                    - generic [ref=e177]:
                      - img [ref=e178]
                      - img [ref=e180]
                      - img [ref=e182]
                      - img [ref=e184]
                      - img [ref=e186]
                  - cell [ref=e188]:
                    - generic [ref=e189]:
                      - button [ref=e190]:
                        - img
                      - button [ref=e191]:
                        - img
                - row "Netflix $15.99 Monthly 2026-06-01" [ref=e192] [cursor=pointer]:
                  - cell "Netflix" [ref=e193]
                  - cell "$15.99" [ref=e194]
                  - cell "Monthly" [ref=e195]
                  - cell "2026-06-01" [ref=e196]
                  - cell [ref=e197]:
                    - generic [ref=e198]:
                      - img [ref=e199]
                      - img [ref=e201]
                      - img [ref=e203]
                      - img [ref=e205]
                      - img [ref=e207]
                  - cell [ref=e209]:
                    - generic [ref=e210]:
                      - button [ref=e211]:
                        - img
                      - button [ref=e212]:
                        - img
                - row "Spotify $9.99 Monthly 2026-06-05" [ref=e213] [cursor=pointer]:
                  - cell "Spotify" [ref=e214]
                  - cell "$9.99" [ref=e215]
                  - cell "Monthly" [ref=e216]
                  - cell "2026-06-05" [ref=e217]
                  - cell [ref=e218]:
                    - generic [ref=e219]:
                      - img [ref=e220]
                      - img [ref=e222]
                      - img [ref=e224]
                      - img [ref=e226]
                      - img [ref=e228]
                  - cell [ref=e230]:
                    - generic [ref=e231]:
                      - button [ref=e232]:
                        - img
                      - button [ref=e233]:
                        - img
                - row "Spotify $9.99 Monthly 2026-06-05" [ref=e234] [cursor=pointer]:
                  - cell "Spotify" [ref=e235]
                  - cell "$9.99" [ref=e236]
                  - cell "Monthly" [ref=e237]
                  - cell "2026-06-05" [ref=e238]
                  - cell [ref=e239]:
                    - generic [ref=e240]:
                      - img [ref=e241]
                      - img [ref=e243]
                      - img [ref=e245]
                      - img [ref=e247]
                      - img [ref=e249]
                  - cell [ref=e251]:
                    - generic [ref=e252]:
                      - button [ref=e253]:
                        - img
                      - button [ref=e254]:
                        - img
                - row "YouTube Premium $13.99 Monthly 2026-06-10" [ref=e255] [cursor=pointer]:
                  - cell "YouTube Premium" [ref=e256]
                  - cell "$13.99" [ref=e257]
                  - cell "Monthly" [ref=e258]
                  - cell "2026-06-10" [ref=e259]
                  - cell [ref=e260]:
                    - generic [ref=e261]:
                      - img [ref=e262]
                      - img [ref=e264]
                      - img [ref=e266]
                      - img [ref=e268]
                      - img [ref=e270]
                  - cell [ref=e272]:
                    - generic [ref=e273]:
                      - button [ref=e274]:
                        - img
                      - button [ref=e275]:
                        - img
                - row "YouTube Premium $13.99 Monthly 2026-06-10" [ref=e276] [cursor=pointer]:
                  - cell "YouTube Premium" [ref=e277]
                  - cell "$13.99" [ref=e278]
                  - cell "Monthly" [ref=e279]
                  - cell "2026-06-10" [ref=e280]
                  - cell [ref=e281]:
                    - generic [ref=e282]:
                      - img [ref=e283]
                      - img [ref=e285]
                      - img [ref=e287]
                      - img [ref=e289]
                      - img [ref=e291]
                  - cell [ref=e293]:
                    - generic [ref=e294]:
                      - button [ref=e295]:
                        - img
                      - button [ref=e296]:
                        - img
          - button "Încarcă următoarea pagină" [ref=e297] [cursor=pointer]
        - generic [ref=e298]:
          - generic [ref=e299]:
            - generic [ref=e300]:
              - heading "Statistics" [level=3] [ref=e301]
              - paragraph [ref=e302]: Category Breakdown
              - generic [ref=e304]:
                - img [ref=e305]:
                  - generic [ref=e307]:
                    - img [ref=e309]
                    - img [ref=e311]
                    - img [ref=e313]
                - list [ref=e315]:
                  - listitem [ref=e316]:
                    - img [ref=e317]
                    - text: Entertainment
                  - listitem [ref=e319]:
                    - img [ref=e320]
                    - text: Music
                  - listitem [ref=e322]:
                    - img [ref=e323]
                    - text: Cloud Storage
            - generic [ref=e325]:
              - generic [ref=e327]:
                - heading "Weekly Payment Breakdown" [level=3] [ref=e328]
                - paragraph [ref=e329]: "Total due this week: $19.14"
              - img [ref=e332]:
                - generic [ref=e334]:
                  - generic [ref=e336]: Mon
                  - generic [ref=e338]: Tue
                  - generic [ref=e340]: Wed
                  - generic [ref=e342]: Thu
                  - generic [ref=e344]: Fri
                  - generic [ref=e346]: Sat
                  - generic [ref=e348]: Sun
                - generic [ref=e350]:
                  - generic [ref=e352]: "0"
                  - generic [ref=e354]: "2"
                  - generic [ref=e356]: "4"
                  - generic [ref=e358]: "6"
                  - generic [ref=e360]: "8"
            - generic [ref=e378]:
              - heading "Value for Money Rating" [level=3] [ref=e379]
              - generic [ref=e380]:
                - generic [ref=e381]:
                  - generic [ref=e382]: Netflix · $15.99/mo
                  - generic [ref=e383]:
                    - generic [ref=e384]: ★
                    - generic [ref=e385]: ★
                    - generic [ref=e386]: ★
                    - generic [ref=e387]: ★
                    - generic [ref=e388]: ★
                - generic [ref=e389]:
                  - generic [ref=e390]: Netflix · $15.99/mo
                  - generic [ref=e391]:
                    - generic [ref=e392]: ★
                    - generic [ref=e393]: ★
                    - generic [ref=e394]: ★
                    - generic [ref=e395]: ★
                    - generic [ref=e396]: ★
                - generic [ref=e397]:
                  - generic [ref=e398]: Spotify · $9.99/mo
                  - generic [ref=e399]:
                    - generic [ref=e400]: ★
                    - generic [ref=e401]: ★
                    - generic [ref=e402]: ★
                    - generic [ref=e403]: ★
                    - generic [ref=e404]: ★
                - generic [ref=e405]:
                  - generic [ref=e406]: Spotify · $9.99/mo
                  - generic [ref=e407]:
                    - generic [ref=e408]: ★
                    - generic [ref=e409]: ★
                    - generic [ref=e410]: ★
                    - generic [ref=e411]: ★
                    - generic [ref=e412]: ★
          - generic [ref=e413]:
            - generic [ref=e414]:
              - img [ref=e416]
              - generic [ref=e418]:
                - heading "Security Alerts" [level=3] [ref=e419]
                - paragraph [ref=e420]: Flagged User Activity Observation
            - generic [ref=e422]:
              - generic [ref=e423]:
                - generic [ref=e424]:
                  - img [ref=e426]
                  - generic [ref=e431]:
                    - paragraph [ref=e432]: admin_user
                    - paragraph [ref=e433]: Bulk deletion suspected
                - generic [ref=e434]:
                  - img [ref=e435]
                  - text: May 21, 2026, 7:11 PM
              - generic [ref=e438]:
                - generic [ref=e439]:
                  - img [ref=e441]
                  - generic [ref=e446]:
                    - paragraph [ref=e447]: admin_user
                    - paragraph [ref=e448]: Bulk deletion suspected
                - generic [ref=e449]:
                  - img [ref=e450]
                  - text: May 21, 2026, 7:11 PM
              - generic [ref=e453]:
                - generic [ref=e454]:
                  - img [ref=e456]
                  - generic [ref=e461]:
                    - paragraph [ref=e462]: normal_user
                    - paragraph [ref=e463]: Bulk deletion suspected
                - generic [ref=e464]:
                  - img [ref=e465]
                  - text: May 21, 2026, 7:08 PM
      - button [ref=e469] [cursor=pointer]:
        - img
  - generic [ref=e470]: "6"
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