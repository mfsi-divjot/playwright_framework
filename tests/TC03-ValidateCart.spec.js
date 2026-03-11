const {test} = require('@playwright/test')
const Dashboard = require('../pageObjects/Dashboard')
const ProductList = require('../pageObjects/ProductList')
const ProductDetail = require('../pageObjects/ProductDetail')
const Cart = require('../pageObjects/Cart')

let dashboard, productList, productDetail, cart;

test.beforeEach('Launch Amazon', async({page})=>{
    await page.goto('/');

    dashboard = new Dashboard(page);
    productList = new ProductList(page);
    cart = new Cart(page);
    productDetail = new ProductDetail(page);

    await dashboard.validateDashboardPage();
})

test.describe('Amazon - Validate Cart', ()=>{
    test('Amazon - Validate Cart', async({page})=>{
        await dashboard.enterSearchItem('Laptop');
        await dashboard.clickOnSearch();

        const ProductInfo = await productList.getProductInfo(1);

        await productList.addItemToCart(0);
        await productList.openProductDetail(1);

        // productDetail = new ProductDetail(page);

        await productDetail.validateProductTitle(ProductInfo.title);
        await productDetail.validateProductPrice(ProductInfo.price);
        await productDetail.clickOnAddToCart();
        await productDetail.goToCart();
        
        await cart.validateItemPrice();
        await cart.increaseQuantityByOne();
        await cart.decreaseQuantityByOne();
        await cart.validateItemCount();
        
    })
})