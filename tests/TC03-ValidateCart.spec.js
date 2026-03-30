const {test} = require('@playwright/test')
const Dashboard = require('../pageObjects/Dashboard')
const ProductList = require('../pageObjects/ProductList')
const ProductDetail = require('../pageObjects/ProductDetail')
const Cart = require('../pageObjects/Cart')
const Screenshot = require('../utils/Screenshot')

let dashboard, productList, productDetail, cart;

test.beforeEach('Launch Amazon', async({page})=>{
    await page.goto('/');

    dashboard = new Dashboard(page);
    productList = new ProductList(page);
    cart = new Cart(page);
    productDetail = new ProductDetail(page);

    await dashboard.validateDashboardPage('https://www.amazon.in');
})

test.describe('Amazon - Validate Cart', ()=>{
    test('Amazon - Validate Cart', async({page})=>{
        await dashboard.enterSearchItem('Laptop');
        await dashboard.clickOnSearch();

        const ProductInfo = await productList.getProductInfo(1);

        await productList.addItemToCartOption(0); 
        await productList.validateCartCount('1');
        await productList.openProductDetailOption(1);

        await productDetail.validateProductTitle(ProductInfo.title);
        await productDetail.validateProductPrice(ProductInfo.price);
        await productDetail.clickOnAddToCart();
        await productList.validateCartCount('2');
        await Screenshot.fullPage(page, 'Validate Cart Count');
        await productDetail.goToCart();
        
        // store total sum & validate 
        const finalTotalPrice = await cart.getTotalPrice();
        await cart.sumAndvalidateTotalItemsPrice(finalTotalPrice);
        await cart.increaseItemByOneOption(0);
        await cart.validateItemCount('2'); // first item count
        await Screenshot.fullPage(page, 'Validate Count Increase');
        await cart.decreaseItemByOneOption(1); 
        await cart.validateItemDeleted(1);
        await Screenshot.fullPage(page, 'Validate Count Decrease');
    })
})
test.afterEach('Empty Cart', async({page})=>{
    await cart.removeAllItemsFromCart();   
    await cart.validateCartItemText('0 items');
    await Screenshot.fullPage(page, 'Validate Cart Empty')
})
