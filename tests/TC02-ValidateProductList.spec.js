const {test} = require('@playwright/test')
const Dashboard = require('../pageObjects/Dashboard')
const ProductList = require('../pageObjects/ProductList')

let dashboard, productList;
test.beforeEach('Launch Amazon', async({page})=>{
    await page.goto('/');

    dashboard = new Dashboard(page);
    productList = new ProductList(page);

    await dashboard.validateDashboardPage();
})
test.describe('Amazon - Verify Product List',()=>{
    test('Amazon - Validate Product List', async({page})=>{
        await dashboard.enterSearchItem('Laptop');
        await dashboard.clickOnSearch();

        await productList.selectBrand('HP');
        await productList.selectPriceRange();
        // select any feature from sort by and make sure the list is given in that order
        // await productList.selectSortOption('Price: Low to High'); 
        await productList.validateTitle('HP');

        // await page.waitForTimeout(3000);

    })
})