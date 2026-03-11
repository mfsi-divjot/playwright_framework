const {test} = require('@playwright/test')
const Dashboard = require('../pageObjects/Dashboard');
const ProductList = require('../pageObjects/ProductList');

let dashboard, productList;
test.beforeEach('Launch Amazon', async({page})=>{
    await page.goto('/');
    dashboard = new Dashboard(page);
    productList = new ProductList(page);

    await dashboard.validateDashboardPage();
})
test.describe('Amazon - Validate Product List', ()=>{
    test.skip('Amazon - Verify Product List', async({page})=>{
        await dashboard.enterSearchItem('Laptop');
        await dashboard.clickOnSearch();
        await productList.selectBrandName('HP');
        await productList.chooseFirstPrice();
        await productList.clickOnShowResults();
        await productList.validateTitle('HP');

        await page.waitForTimeout(5000);
    })
})