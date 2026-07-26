import { test, expect } from "@playwright/test";

test.describe("Search Flow E2E", () => {
  test("user can type keyword, view search results, and navigate to detail page", async ({ page }) => {
    // Navigate to search page
    await page.goto("/search");

    // Type query in search input
    const searchInput = page.getByRole("textbox", { name: /search inputs/i });
    await searchInput.fill("MacBook");

    // Click search button
    await page.click('button:has-text("RUN ANALYSIS")');

    // Wait for search results
    await expect(page.getByText(/Apple MacBook Pro/i)).toBeVisible();

    // Click details button on first product card
    const detailsButton = page.locator('button:has-text("Details"), a:has-text("Details")').first();
    await detailsButton.click();

    // Verify navigation to product detail page
    await expect(page).toHaveURL(/\/product\//);
  });
});
