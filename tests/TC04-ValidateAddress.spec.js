const {test, expect} = require('@playwright/test')
const {user} = require('../testData/UserData')
const SignIn = require('../pageObjects/SignIn')
const Dashboard = require('../pageObjects/Dashboard');
const Address = require('../pageObjects/Address');
const Screenshot = require('../utils/Screenshot');

let signIn; 
let dashboard;
let address;
test.beforeEach(('Launch Amazon'), async({page})=>{
    await page.goto('/');
    
    dashboard = new Dashboard(page);
    signIn = new SignIn(page);
    address = new Address(page);

    await dashboard.validateDashboardPage();
})
test.describe('Amazon - Validate Cart Functionality', ()=>{
    test('Amazon - Validate Cart Functionality', async({page})=>{
        await dashboard.clickOnUserAccount();
        await signIn.enterEmail(user.email);
        await signIn.clickContinue();
        await signIn.enterPassword(user.password);
        await signIn.clickSignIn();
        await signIn.validateUserLogin(user.name);
        await dashboard.clickOnLocation();
        await address.clickOnAddAddress();
        await address.enterUserDetails(user.name, user.number, user.code, user.houseNo, 
        user.village,user.landmark);
        await address.validateAddress("Address saved");
        await Screenshot.fullPage(page, 'Validate Address saved');
        await Screenshot.fullPage(page, 'Validate Address saved');
        // await expect(page).toHaveScreenshot({fullPage:true,name : 'address-added.png'});
        await address.validateLastAddressDetails(user.name, user.houseNo, user.village, 
        user.code, user.number);
        await address.updateUsernameInLastAddress(user.updatedUsername);
        await address.validateAddress("Address saved");
        await address.validateUpdateUsernameInLastAddress(user.updatedUsername);
        await address.removeLastAddress();
        await address.validateAddress("Address deleted");
        // await Screenshot.viewport(page, 'Validate Address Deleted');
        // await expect(page).toHaveScreenshot({name : 'address-deleted.png', 
        //     maxDiffPixelRatio : 0.02
        // });
    })
})