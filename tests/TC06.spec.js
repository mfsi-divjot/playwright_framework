const {test, chromium} = require('@playwright/test')
const {user} = require('../testData/UserData')
const Dashboard = require('../pageObjects/Dashboard')
const ProductList = require('../pageObjects/ProductList');
const ProductDetail = require('../pageObjects/ProductDetail');
const SignIn = require('../pageObjects/SignIn');
const Wishlist = require('../pageObjects/Wishlist');

// ...existing code...

let context, page;
let dashboard, productList, productDetail, signIn, wishlist, productInfo;

const SEARCH_TERM = 'Laptop';
const WISHLIST_NAME = 'Wishlist 1';
const EXPECT_EMPTY_MSG = 'There are no items in this List';

test.beforeAll('Launch Amazon, sign in and prepare wishlist', async({browser})=>{
    // browser = await chromium.launch();
    context = await browser.newContext({storageState: 'storageState.json'});
    page = await context.newPage();

    await page.goto('/');
    // await page.waitForLoadState('networkidle');
    

    dashboard = new Dashboard(page);
    productList = new ProductList(page);
    productDetail = new ProductDetail(page);
    signIn = new SignIn(page);
    wishlist = new Wishlist(page);

    await dashboard.validateDashboardPage('https://www.amazon.in');

    // Sign in once for all tests
    // await dashboard.clickOnUserAccount();
    // await signIn.enterEmail(user.email);
    // await signIn.clickContinue();
    // await signIn.enterPassword(user.password);
    // await signIn.clickSignIn();
    // await signIn.validateUserLogin(user.name);

    // Prepare wishlist items used by tests (adds 3 items) to keep tests independent
    await dashboard.enterSearchItem(SEARCH_TERM);
    await dashboard.clickOnSearch();

    productInfo = await productList.getProductInfo(2);

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
})

test.describe.serial('Amazon - Validate Wishlist', ()=>{ 
    test('Search item in wishlist', async()=>{
        await dashboard.openWishlist();
        await wishlist.searchItemInWishlist(productInfo.title); 
        await wishlist.validateSearchedItem(productInfo.title);
    })

    test('Delete searched item', async()=>{
        await dashboard.openWishlist();
        await wishlist.searchItemInWishlist(productInfo.title); 
        await wishlist.validateSearchedItem(productInfo.title);
        await wishlist.deleteSearchedItem(); 
        await wishlist.validateItemDeleted(EXPECT_EMPTY_MSG);
    })

    test('Rename wishlist', async()=>{
        await dashboard.openWishlist();
        await wishlist.openManageList();
        await wishlist.renameWishlistName(WISHLIST_NAME);
        await wishlist.validateWishlistName(WISHLIST_NAME);
    })
})

test.afterAll('Test Cleanup', async({browser})=>{
    try {
        if (wishlist) {
            await dashboard.openWishlist();
            await wishlist.emptyWishlist();
            await page.reload();
            await wishlist.validateItemDeleted(EXPECT_EMPTY_MSG);
        }
    } finally {
        if (browser) await browser.close();
    }
})
// ...existing code...