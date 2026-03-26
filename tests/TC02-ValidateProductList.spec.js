const {test} = require('@playwright/test')
const Dashboard = require('../pageObjects/Dashboard')
const ProductList = require('../pageObjects/ProductList')
const Screenshot = require('../utils/Screenshot')

let dashboard, productList;

const brand = 'HP';
const filterOption = 'Price: Low to High';

test.beforeEach('Launch Amazon', async({page})=>{
    await page.goto('/');

    dashboard = new Dashboard(page);
    productList = new ProductList(page);

    await dashboard.validateDashboardPage('https://www.amazon.in');
})
test.describe('Amazon - Verify Product List',()=>{
    test('Amazon - Validate Product List', async()=>{
        await dashboard.enterSearchItem('Laptop');
        await dashboard.clickOnSearch();

        await productList.selectBrand(brand);
        await productList.selectPriceRangeOption(1);
        await productList.selectSortOption(filterOption);

        await productList.validateTitle(brand);
        // get min & max price value
        const {finalMinPrice, finalMaxPrice} = await productList.getPriceRange();
        await productList.validatePrice(finalMinPrice, finalMaxPrice);
        await productList.validateSortOption(filterOption);

    })
})