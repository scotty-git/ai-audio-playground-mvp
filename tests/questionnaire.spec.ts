import { test, expect } from '@playwright/test';

// Test data
const personalInfo = {
  name: 'John Doe',
  age: '30',
  sex: 'Male',
  occupation: 'Software Engineer',
  livingSituation: 'Single',  // Updated to match the actual field name
};

test.describe('Questionnaire Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Increase timeouts for navigation
    page.setDefaultTimeout(30000);
    page.setDefaultNavigationTimeout(30000);

    // Navigate to questionnaire and wait for the page to be ready
    await test.step('Navigate to questionnaire', async () => {
      await page.goto('/questionnaire');
      await page.waitForLoadState('networkidle');
    });
  });

  test('should complete personal information form', async ({ page }) => {
    await test.step('Fill personal info form', async () => {
      const form = page.locator('[data-testid="personal-info-form"]');
      await expect(form).toBeVisible({ timeout: 10000 });
      
      await form.locator('[name="name"]').fill(personalInfo.name);
      await form.locator('[name="age"]').fill(personalInfo.age);
      await form.locator('[name="sex"]').selectOption(personalInfo.sex);
      await form.locator('[name="occupation"]').fill(personalInfo.occupation);
      await form.locator('[name="livingSituation"]').selectOption(personalInfo.livingSituation);
      
      await form.locator('button[type="submit"]').click();
      
      // Wait for state update
      await page.waitForTimeout(1000);
      
      // Verify the next form is visible
      await expect(page.locator('[data-testid="strengths-form"]')).toBeVisible({
        timeout: 10000
      });
    });
  });
});
