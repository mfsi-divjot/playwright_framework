const {test} = require('@playwright/test');
const Dashboard = require('../pageObjects/Dashboard');
const Country = require('../pageObjects/Country');

let dashboard, country;

test.beforeEach('Launch Amazon', async({page})=>{
    await page.goto('/');
    dashboard = new Dashboard(page);
    country = new Country(page);

    dashboard.validateAmazonDashboardPage();
})

test.describe('Amazon - Validate Change Country', ()=>{
    test.skip('Amazon - Validate Change Country', async () => {

    await dashboard.dismissCountryAlert();
    await dashboard.openAllCategory();
    await dashboard.clickOnSelectCountry();

    await country.selectCountry('India');
    await country.clickOnGoToWebsite();
    await country.validateCountryName();
});
})