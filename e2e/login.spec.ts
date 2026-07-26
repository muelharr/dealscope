import { test, expect } from "@playwright/test";

test.describe("Login Flow E2E", () => {
  test("user can fill form, submit, and redirect to dashboard", async ({ page }) => {
    // Navigate to login page
    await page.goto("/login");

    // Check title/header
    await expect(page.getByText(/welcome back/i)).toBeVisible();

    // Fill credentials
    await page.fill('input[type="email"]', "admin@dealscope.com");
    await page.fill('input[type="password"]', "password123");

    // Submit form
    await page.click('button[type="submit"]');

    // Verify navigation to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible();
  });
});
