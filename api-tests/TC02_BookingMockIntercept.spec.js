const {test, expect} = require('@playwright/test')

test.describe('Playwright API Mock & Intercept Functionality', async()=>{
    test('Intercept Dummy Response', async({page})=>{
        await page.route('**/api/v1/fruits', async route=>{
            await route.fulfill({
                status : 200,
                contentType : 'application/json',
                body : JSON.stringify([
                    {
                        id : 71, name : 'Cypress'
                    },
                    {
                        id : 72, name : 'WebdriverIO'
                    }
                ])
            })
        })
        await page.goto('https://demo.playwright.dev/api-mocking/')
        await expect(page.getByText('Cypress')).toBeVisible();
        await expect(page.getByText('WebdriverIO')).toBeVisible();
    })
    test('Intercept Real Response', async({page})=>{
        await page.route('**/api/v1/fruits', async route => {
        const response = await route.fetch();          // call real API
        const data = await response.json();
        data.push({ id: 99, name: 'ExtraFruit' });    // modify server data
        await route.fulfill({                          // return modified
            status: response.status(),
            contentType: 'application/json',
            body: JSON.stringify(data)
        });
        });
        await page.goto('https://demo.playwright.dev/api-mocking/')
        await expect(page.getByText('ExtraFruit')).toBeVisible();
    })
})
