const {test, expect} = require('@playwright/test')
const {user} = require('../testData/UserData')
const SignIn = require('../pageObjects/SignIn')
const Dashboard = require('../pageObjects/Dashboard');
const Address = require('../pageObjects/Address');
const Screenshot = require('../utils/Screenshot')

let signIn; 
let dashboard;
let address;
test.beforeEach(('Launch Amazon'), async({page})=>{
    await page.goto('/');
    
    dashboard = new Dashboard(page);
    signIn = new SignIn(page);
    address = new Address(page);

    await dashboard.validateDashboardPage('https://www.amazon.in');

    await dashboard.clickOnUserAccount();
    await signIn.enterEmail(user.email);
    await signIn.clickContinue();
    await signIn.enterPassword(user.password);
    await signIn.clickSignIn();
    await signIn.validateUserLogin(user.name);
})
test.describe('Amazon - Validate Address Functionality', ()=>{
    test('Amazon - Validate Address Functionality', async({page})=>{
        await dashboard.clickOnLocation();
        await address.clickOnAddAddress();
        await address.enterUserDetails(user); 
        await address.validateAddress("Address saved");
        await address.validateLastAddedAddress(user); 
        await Screenshot.fullPage(page, 'Validate Address Saved');

        await address.updateUsernameInLastAddress(user.updatedUsername);
        await address.validateAddress("Address saved");
        await Screenshot.fullPage(page, 'Validate Address Updated');

        await address.validateUpdateUsernameInLastAddress(user.updatedUsername);
        await address.removeLastAddress();
        await address.validateAddress("Address deleted"); 
        await address.validateLastAddressDeleted(user.updatedUsername);
        await Screenshot.fullPage(page, 'Validate Address Deleted');
    })
})