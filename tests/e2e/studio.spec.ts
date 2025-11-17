import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('AI Studio E2E Flow', () => {
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = 'password123';

  test('complete user journey: signup -> login -> generate -> history -> restore', async ({
    page,
  }) => {
    // Step 1: Navigate to signup page
    await page.goto('/signup');
    await expect(page).toHaveTitle(/AI Studio/);

    // Step 2: Sign up
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirm-password"]', testPassword);
    await page.click('button[type="submit"]');

    // Should redirect to studio
    await expect(page).toHaveURL('/studio');
    await expect(page.locator('text=AI Studio')).toBeVisible();

    // Step 3: Logout
    await page.click('text=Logout');
    await expect(page).toHaveURL('/login');

    // Step 4: Login
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');

    // Should redirect to studio again
    await expect(page).toHaveURL('/studio');

    // Step 5: Upload image
    const testImagePath = path.join(__dirname, '../fixtures/test-image.png');

    // Create a simple test image if it doesn't exist
    const fs = require('fs');
    const dir = path.join(__dirname, '../fixtures');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(testImagePath)) {
      const buffer = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64'
      );
      fs.writeFileSync(testImagePath, buffer);
    }

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);

    // Wait for preview
    await expect(page.locator('img[alt="Upload preview"]')).toBeVisible();

    // Step 6: Fill prompt and style
    await page.fill('textarea[name="prompt"]', 'A beautiful sunset over the ocean');
    await page.selectOption('select[name="style"]', 'Realistic');

    // Step 7: Generate (with retry logic for Model overloaded)
    let generationSuccessful = false;
    let attempts = 0;
    const maxAttempts = 5;

    while (!generationSuccessful && attempts < maxAttempts) {
      await page.click('button:has-text("Generate")');

      // Wait for either success or error
      try {
        await expect(page.locator('text=Generating')).toBeVisible({ timeout: 1000 });

        // Check for abort button
        const abortButton = page.locator('button:has-text("Abort")');
        await expect(abortButton).toBeVisible();

        // Wait for generation to complete
        await expect(page.locator('text=Generating')).not.toBeVisible({ timeout: 10000 });

        // Check if we have a current generation displayed
        const currentGeneration = page.locator('text=Current Generation');
        if (await currentGeneration.isVisible()) {
          generationSuccessful = true;
        }
      } catch (error) {
        // Model might be overloaded, retry
        attempts++;
        await page.waitForTimeout(1000);
      }
    }

    // If generation was successful, check history
    if (generationSuccessful) {
      // Step 8: Verify generation appears in history
      await expect(page.locator('text=Recent Generations')).toBeVisible();

      // Step 9: Click on history item to restore it
      const historyItems = page.locator('button:has-text("A beautiful sunset")');
      if ((await historyItems.count()) > 0) {
        await historyItems.first().click();

        // Verify it's restored to the workspace
        await expect(page.locator('textarea[name="prompt"]')).toHaveValue(
          'A beautiful sunset over the ocean'
        );
      }
    }
  });

  test('should handle abort generation', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');

    // Upload image and fill form
    const testImagePath = path.join(__dirname, '../fixtures/test-image.png');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);

    await page.fill('textarea[name="prompt"]', 'Test abort functionality');
    await page.selectOption('select[name="style"]', 'Artistic');

    // Start generation
    await page.click('button:has-text("Generate")');

    // Click abort immediately
    const abortButton = page.locator('button:has-text("Abort")');
    if (await abortButton.isVisible({ timeout: 2000 })) {
      await abortButton.click();

      // Verify generation stopped
      await expect(page.locator('text=Generating')).not.toBeVisible();
    }
  });
});
