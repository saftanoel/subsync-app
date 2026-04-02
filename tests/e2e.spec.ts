import { test, expect } from "@playwright/test";

test.describe("SubSync E2E Tests", () => {
  // ==================== LOGIN ====================
  test("1. User can log in with demo credentials", async ({ page }) => {
    await page.goto("/");

    // Navigate to login from landing page
    await page.click('a[href="/login"]');
    await expect(page.locator("h1")).toContainText("Welcome back");

    // Fill credentials
    await page.fill('input[id="email"]', "demo@subsync.com");
    await page.fill('input[id="password"]', "password123");
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator("h1")).toContainText("Your Subscriptions");
  });

  test("1b. Login fails with wrong credentials", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[id="email"]', "wrong@email.com");
    await page.fill('input[id="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    // Should stay on login and show error
    await expect(page).toHaveURL(/login/);
    await expect(page.locator("text=Invalid email or password")).toBeVisible();
  });

  test("1c. Login shows validation when fields are empty", async ({ page }) => {
    await page.goto("/login");
    await page.click('button[type="submit"]');

    // Should stay on login with error message
    await expect(page).toHaveURL(/login/);
    await expect(page.locator("text=All fields are required")).toBeVisible();
  });

  // ==================== ADD SUBSCRIPTION ====================
  test("2. User can add a new subscription", async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.fill('input[id="email"]', "demo@subsync.com");
    await page.fill('input[id="password"]', "password123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/);

    // Count subscriptions in stats card
    const activeSubsText = await page.locator("text=Active Subs").locator("..").locator("..").textContent();

    // Click "Add Subscription" button in the header
    await page.click('button:has-text("Add Subscription")');

    // Form modal should appear
    await expect(page.locator("h2:has-text('Add Subscription')")).toBeVisible();

    // Fill the form - service name input (placeholder "Netflix")
    await page.fill('input[placeholder="Netflix"]', "Disney Plus");

    // Fill cost input (placeholder "9.99")
    await page.fill('input[placeholder="9.99"]', "13.99");

    // Fill next payment date
    await page.fill('input[type="date"]', "2024-12-15");

    // Submit the form
    await page.click('button[type="submit"]:has-text("Add Subscription")');

    // Modal should close and new subscription should be visible in the table
    // Navigate to last page if needed - Disney Plus should appear
    // Check it's somewhere in the page
    await expect(page.locator("td:has-text('Disney Plus')")).toBeVisible({ timeout: 5000 });
  });

  test("2b. Form validation prevents empty submission", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[id="email"]', "demo@subsync.com");
    await page.fill('input[id="password"]', "password123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/);

    // Open form
    await page.click('button:has-text("Add Subscription")');
    await expect(page.locator("h2:has-text('Add Subscription')")).toBeVisible();

    // Submit without filling anything
    await page.click('button[type="submit"]:has-text("Add Subscription")');

    // Validation errors should appear
    await expect(page.locator("text=Service name is required")).toBeVisible();
    await expect(page.locator("text=Enter a valid positive cost")).toBeVisible();
    await expect(page.locator("text=Next payment date is required")).toBeVisible();
  });

  // ==================== DELETE SUBSCRIPTION ====================
  test("3. User can delete a subscription", async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.fill('input[id="email"]', "demo@subsync.com");
    await page.fill('input[id="password"]', "password123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/);

    // Count rows before deletion
    const rowsBefore = await page.locator("tbody tr").count();
    expect(rowsBefore).toBeGreaterThan(0);

    // Get the name of the first subscription to verify it's removed
    const firstName = await page.locator("tbody tr").first().locator("td").first().textContent();

    // Click the delete button (Trash2 icon) on the first row - it's the last button in the actions cell
    const firstRow = page.locator("tbody tr").first();
    const deleteBtn = firstRow.locator('button').last();
    await deleteBtn.click();

    // Verify one fewer row
    const rowsAfter = await page.locator("tbody tr").count();
    expect(rowsAfter).toBe(rowsBefore - 1);
  });

  test("3b. Deleting all visible rows works without errors", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[id="email"]', "demo@subsync.com");
    await page.fill('input[id="password"]', "password123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/);

    // Delete the 5 visible rows on page 1
    for (let i = 0; i < 5; i++) {
      const row = page.locator("tbody tr").first();
      const isDataRow = await row.locator("td").count();
      if (isDataRow > 1) {
        await row.locator("button").last().click();
        await page.waitForTimeout(300); // wait for animation
      }
    }

    // Page should still be functional
    await expect(page.locator("h1")).toContainText("Your Subscriptions");
  });
});
