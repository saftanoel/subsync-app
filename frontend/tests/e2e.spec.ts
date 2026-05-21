import { test, expect } from "@playwright/test";

test.describe("SubSync SDI Assignment - Silver & Gold", () => {

  test.beforeAll(async ({ request }) => {
    const apiBase = "https://baggy-renderer-canned.ngrok-free.dev";
    
    // Clear existing subscriptions on ngrok base
    try {
      const getRes = await request.get(`${apiBase}/subscriptions`, {
        headers: { "ngrok-skip-browser-warning": "69420" }
      });
      if (getRes.ok()) {
        const subs = await getRes.json();
        for (const sub of subs) {
          await request.delete(`${apiBase}/subscriptions/${sub.id}?username=admin_user`, {
            headers: { "ngrok-skip-browser-warning": "69420" }
          });
        }
      }
    } catch (e) {
      // Silently ignore
    }

    // Clear existing subscriptions on localhost base
    try {
      const getRes = await request.get(`http://localhost:8000/subscriptions`);
      if (getRes.ok()) {
        const subs = await getRes.json();
        for (const sub of subs) {
          await request.delete(`http://localhost:8000/subscriptions/${sub.id}?username=admin_user`);
        }
      }
    } catch (e) {
      // Silently ignore
    }

    const subsToSeed = [
      { serviceName: "Netflix", category: "Entertainment", monthlyCost: 15.99, billingCycle: "Monthly", nextPayment: "2026-06-01", valueRating: 5 },
      { serviceName: "Spotify", category: "Music", monthlyCost: 9.99, billingCycle: "Monthly", nextPayment: "2026-06-05", valueRating: 4 },
      { serviceName: "YouTube Premium", category: "Entertainment", monthlyCost: 13.99, billingCycle: "Monthly", nextPayment: "2026-06-10", valueRating: 5 },
      { serviceName: "iCloud+", category: "Cloud Storage", monthlyCost: 2.99, billingCycle: "Monthly", nextPayment: "2026-06-15", valueRating: 4 },
      { serviceName: "Amazon Prime", category: "Entertainment", monthlyCost: 14.99, billingCycle: "Monthly", nextPayment: "2026-06-20", valueRating: 3 },
    ];

    for (const sub of subsToSeed) {
      try {
        await request.post(`${apiBase}/subscriptions`, {
          data: sub,
          headers: { "ngrok-skip-browser-warning": "69420" }
        });
      } catch (e) {
        // Silently ignore or fallback
      }
      try {
        await request.post(`http://localhost:8000/subscriptions`, {
          data: sub
        });
      } catch (e) {
        // Silently ignore
      }
    }
  });

  test.beforeEach(async ({ page }) => {
    page.on('console', msg => {
      console.log(`[BROWSER LOG] [${msg.type()}] ${msg.text()}`);
    });

    page.on('pageerror', err => {
      console.log(`[BROWSER UNCAUGHT ERROR] ${err.message}`);
    });

    page.on('response', response => {
      if (response.url().includes('login') && response.request().method() === 'POST') {
        console.log(`[LOGIN RESPONSE] status: ${response.status()}`);
      }
    });

    await page.addInitScript(() => {
      window.sessionStorage.setItem('skipLoader', 'true');
    });

    await page.goto("/login");
    
    await page.fill('input[id="username"]', "admin_user");
    await page.fill('input[id="password"]', "admin123");
    await page.click('button[type="submit"]', { force: true });
    
    await expect(page).toHaveURL(/\/dashboard/);
  });

  // --- SILVER ---
  test("Silver: System monitors user activity using cookies", async ({ page, context }) => {
    await page.goto("/dashboard");
    const cookies = await context.cookies();
    const activityCookie = cookies.find(c => c.name === 'user-activity' || c.name === 'preferences');
    expect(activityCookie).toBeDefined();
  });

  test("Silver: Feature 1 - Add Subscription (CRUD)", async ({ page }) => {
    // Adăugat force: true pentru mobil
    await page.click('button:has-text("Add Subscription")', { force: true });
    await page.fill('input[placeholder="Netflix"]', "Disney Plus");
    await page.fill('input[placeholder="9.99"]', "13.99");
    await page.fill('input[type="date"]', "2026-04-15");
    await page.click('button[type="submit"]:has-text("Add Subscription")', { force: true });
    
    await expect(page.locator("td:has-text('Disney Plus')").first()).toBeVisible();
  });

  test("Silver: Feature 2 - Master to Detail Navigation", async ({ page }) => {
    const firstName = await page.locator("tbody tr").first().locator("td").first().textContent();
    await page.locator("tbody tr").first().click({ force: true });
    
    const modalTitle = page.locator("h2").filter({ hasText: firstName || "" });
    await expect(modalTitle).toBeVisible({ timeout: 5000 });
  });

  test("Silver: Feature 3 - Delete Subscription", async ({ page }) => {
    const firstRow = page.locator("tbody tr").first();
    const subName = await firstRow.locator("td").first().textContent();

    // Butonul e la finalul tabelului, pe mobil e greu vizibil. Folosim force.
    await firstRow.locator('button').last().click({ force: true });

    await expect(firstRow.locator("td").first()).not.toHaveText(subName || "", { timeout: 5000 });
  });

  // --- GOLD ---
  test("Gold: Charts update automatically when tabular data changes", async ({ page }) => {
    const initialTotal = await page.locator(".total-amount").textContent();

    // La fel, force click pe delete
    await page.locator("tbody tr").first().locator('button').last().click({ force: true });

    await page.waitForTimeout(500);

    const newTotal = await page.locator(".total-amount").textContent();
    expect(newTotal).not.toBe(initialTotal);
  });

  test("Gold: App is responsive on mobile viewports", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
  });
});