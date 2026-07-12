import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await page.goto("/items/snippet");
});

test("edits an item's title through the drawer and persists the change", async ({ page }) => {
  const cardTitle = page.locator("h3.font-semibold").first();
  const originalTitle = await cardTitle.innerText();

  await cardTitle.click();

  const drawer = page.getByRole("dialog");
  await expect(drawer).toBeVisible();

  await drawer.getByRole("button", { name: "Edit item" }).click();

  const titleInput = drawer.getByPlaceholder("Title");
  await titleInput.fill("");
  const updatedTitle = `${originalTitle} (edited)`;
  await titleInput.fill(updatedTitle);

  await drawer.getByRole("button", { name: "Save" }).click();

  await expect(page.getByText("Item updated.")).toBeVisible();
  await expect(drawer.getByRole("heading", { name: updatedTitle })).toBeVisible();

  // revert so the seeded data stays clean for future runs
  await drawer.getByRole("button", { name: "Edit item" }).click();
  await titleInput.fill("");
  await titleInput.fill(originalTitle);
  await drawer.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Item updated.")).toBeVisible();
});

test("cancel discards edits and keeps the original title", async ({ page }) => {
  const cardTitle = page.locator("h3.font-semibold").first();
  const originalTitle = await cardTitle.innerText();

  await cardTitle.click();

  const drawer = page.getByRole("dialog");
  await expect(drawer).toBeVisible();

  await drawer.getByRole("button", { name: "Edit item" }).click();
  await drawer.getByPlaceholder("Title").fill("Should not be saved");
  await drawer.getByRole("button", { name: "Cancel" }).click();

  await expect(drawer.getByRole("heading", { name: originalTitle })).toBeVisible();
});
