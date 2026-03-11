const {test} = require('@playwright/test')
const {user} = require('../testData/UserData')
const Dashboard = require('../pageObjects/Dashboard')
const ProductList = require('../pageObjects/ProductList');
const ProductDetail = require('../pageObjects/ProductDetail');
const SignIn = require('../pageObjects/SignIn');
const Wishlist = require('../pageObjects/Wishlist');

let dashboard, productList, productDetail, signIn, wishlist;

test.beforeEach('Launch Amazon', async({page})=>{
    await page.goto('/');

    dashboard = new Dashboard(page);
    productList = new ProductList(page);
    productDetail = new ProductDetail(page);
    signIn = new SignIn(page);
    wishlist = new Wishlist(page);

    await dashboard.validateDashboardPage();
})

test.describe('Amazon - Validate Wishlist', ()=>{
    test('Amazon - Validate Wishlist', async({page})=>{
        await dashboard.clickOnUserAccount();
        await signIn.enterEmail(user.email);
        await signIn.clickContinue();
        await signIn.enterPassword(user.password);
        await signIn.clickSignIn();
        await signIn.validateUserLogin(user.name);

        await dashboard.enterSearchItem('Laptop');
        await dashboard.clickOnSearch();

        const ProductInfo = await productList.getProductInfo(1);
        await productList.openProductDetail(1);
        await productDetail.addToWishlist();
        await productDetail.goBack();

        await productList.openProductDetail(2);
        await productDetail.addToWishlist();
        await productDetail.goBack();

        await productList.openProductDetail(3);
        await productDetail.addToWishlist();
        await productDetail.gotToWishlist();

        await wishlist.validateCartCount(3);
        await wishlist.searchandValidateItemInWishlist(ProductInfo.title); // store name and pass in param
        await wishlist.deleteAndValidateSearchedItem(); // again search and get message
        // await wishlist.renameAndValidate('Wishlist 1'); 

        // await page.waitForTimeout(5000);

    })
})