const { chromium } = require('@playwright/test');
const { user } = require('../testData/UserData');
const SignIn = require('../pageObjects/SignIn');
const Dashboard = require('../pageObjects/Dashboard');

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    const dashboard = new Dashboard(page);
    const signIn = new SignIn(page);

    await page.goto('/');

    await dashboard.clickOnUserAccount();
    await signIn.enterEmail(user.email);
    await signIn.clickContinue();
    await signIn.enterPassword(user.password);
    await signIn.clickSignIn();
    await signIn.validateUserLogin(user.name);

    // Save session storage
    await context.storageState({ path: 'storageState.json' });

    await browser.close();
})();