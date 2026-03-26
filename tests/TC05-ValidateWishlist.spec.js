const {test, chromium} = require('@playwright/test')
const {user} = require('../testData/UserData')
const Dashboard = require('../pageObjects/Dashboard')
const ProductList = require('../pageObjects/ProductList');
const ProductDetail = require('../pageObjects/ProductDetail');
const SignIn = require('../pageObjects/SignIn');
const Wishlist = require('../pageObjects/Wishlist');

let browser, context, page;
let dashboard, productList, productDetail, signIn, wishlist, ProductInfo;

test.beforeAll('Launch Amazon', async()=>{
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();

    await page.goto('/');

    dashboard = new Dashboard(page);
    productList = new ProductList(page);
    productDetail = new ProductDetail(page);
    signIn = new SignIn(page);
    wishlist = new Wishlist(page);

    await dashboard.validateDashboardPage('https://www.amazon.in');

    await dashboard.clickOnUserAccount();
    await signIn.enterEmail(user.email);
    await signIn.clickContinue();
    await signIn.enterPassword(user.password);
    await signIn.clickSignIn();
    await signIn.validateUserLogin(user.name);
})
test.describe('Amazon - Validate Wishlist', ()=>{ 
    test('Amazon - Search Item in wishlist', async()=>{

        await dashboard.enterSearchItem('Laptop');
        await dashboard.clickOnSearch();

        ProductInfo = await productList.getProductInfo(2);
        await productList.openProductDetailOption(1);
        await productDetail.addToWishlist();
        await productDetail.goBack();

        await productList.openProductDetailOption(2);
        await productDetail.addToWishlist();
        await productDetail.goBack();

        await productList.openProductDetailOption(3);
        await productDetail.addToWishlist();
        await productDetail.goToWishlist();

        await wishlist.validateCartCount(3);

        await wishlist.searchItemInWishlist(ProductInfo.title); 
        await wishlist.validateSearchedItem(ProductInfo.title);

    })
    test('Amazon - Deleted Seached Item', async()=>{
        await dashboard.openWishlist();

        await wishlist.searchItemInWishlist(ProductInfo.title); 
        await wishlist.validateSearchedItem(ProductInfo.title);

        await wishlist.deleteSearchedItem(); 
        await wishlist.validateItemDeleted('There are no items in this List');

    })
    test('Amazon - Rename Wishlist Name', async()=>{
        await dashboard.openWishlist();
        await wishlist.openManageList();
        await wishlist.renameWishlistName('Wishlist 1');
        await wishlist.validateWishlistName('Wishlist 1');
    })
})
test.afterAll('Test Cleanup', async()=>{
    await wishlist.emptyWishlist();
    await page.reload();
    await wishlist.validateItemDeleted('There are no items in this List');
})