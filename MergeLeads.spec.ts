import { test, expect } from "@playwright/test";

test("Merge Leads with Window handling", async ({ page }) => {
    // 1. Navigate and Login
    await page.goto("http://leaftaps.com/opentaps/control/main");
    await page.locator("#username").fill("Demosalesmanager");
    await page.locator("#password").fill("crmsfa");
    await page.getByRole("button", { name: 'Login' }).click();

    // 2. Navigate to Merge Leads
    await page.getByRole("link", { name: 'CRM/SFA' }).click();
    await page.getByRole("link", { name: 'Leads' }).click();
    await page.locator('//a[text()="Merge Leads"]').click();

    // 3. Handle "From Lead" widget (Window 1)
    const [fromLeadTab] = await Promise.all([
        page.waitForEvent('popup'),
        page.locator("img[alt='Lookup']").first().click()
    ]);
    // Select the first resulting lead ID
    await fromLeadTab.locator(".x-grid3-cell-first a").first().click();

    // 4. Handle "To Lead" widget (Window 2)
    const [toLeadTab] = await Promise.all([
        page.waitForEvent('popup'),
        page.locator("img[alt='Lookup']").last().click()
    ]);
    // Select the second resulting lead ID (nth(1) is the 2nd element)
    await toLeadTab.locator(".x-grid3-cell-first a").nth(1).click();

    // 5. Handling Alert (Capturing message and type)
    page.once('dialog', async (dialog) => {
        console.log(`Alert Message: ${dialog.message()}`);
        console.log(`Alert Type: ${dialog.type()}`);
        await dialog.accept(); 
    });

    // 6. Click Merge and Assert
    await page.getByRole('link', { name: 'Merge', exact: true }).click();

    // Note: In Leaftaps, once you accept the alert, the merge processes. 
    // If the requirement strictly asks for a second click:
    // await page.getByRole('link', { name: 'Merge', exact: true }).click();

    // 7. Assert the title
    await expect(page).toHaveTitle(/View Lead/);
});