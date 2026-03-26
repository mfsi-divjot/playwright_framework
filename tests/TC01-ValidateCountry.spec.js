const {test, expect} = require('@playwright/test');
const Dashboard = require('../pageObjects/Dashboard');
const Country = require('../pageObjects/Country');
const Screenshot = require('../utils/Screenshot')

let dashboard, country;
const countryName = 'India';

test.beforeEach('Launch Amazon', async({page})=>{
    await page.goto('https://www.amazon.com/');
    dashboard = new Dashboard(page);
    country = new Country(page); 

    dashboard.validateDashboardPage('https://www.amazon.com/');
})

test.describe('Amazon - Validate Change Country', ()=>{
    test('Amazon - Validate Change Country', async ({page}) => {
    await dashboard.dismissCountryAlert();
    await dashboard.openAllCategory();
    await dashboard.clickOnSelectCountry();

    // shift focus to new tab
    await country.selectCountry(countryName);
    const newPage = await country.clickOnGoToWebsite();
    country = new Country(newPage);
    await country.validateCountryName(countryName); 
    await Screenshot.fullPage(page, 'Validate Country');
    await expect(page).toHaveScreenshot({fullPage : true});
});
})