const { chromium } = require('@playwright/test');
const { user } = require('./testData/UserData');
const Dashboard = require('./pageObjects/Dashboard');
const SignIn = require('./pageObjects/SignIn');

module.exports = async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // navigate and sign in using existing page objects
    await page.goto(process.env.BASE_URL || 'https://www.amazon.in');
    const dashboard = new Dashboard(page);
    const signIn = new SignIn(page);

    await dashboard.clickOnUserAccount();
    await signIn.enterEmail(user.email);
    await signIn.clickContinue();
    await signIn.enterPassword(user.password);
    await signIn.clickSignIn();

    // give site a moment to settle (adjust if your page objects already wait)
    await page.waitForTimeout(2000);

    // save authenticated storage state for tests
    await context.storageState({ path: 'storageState.json' });

    await browser.close();
};