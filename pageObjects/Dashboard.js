const { expect } = require('@playwright/test');

const locator = {
    input: {
        searchBox: "[role='searchbox']",
        searchBtn: "[value='Go']",
    },
    link: {
        allCategory: "[aria-label*='All Categories']",
        selectCountry: "section [href*='/country']",
        selectedCountry: "section a[href*='/country'] i",
        location : "#nav-global-location-popover-link",
        userAccount : "//span[contains(text(),'Account & Lists')]",
        addAddress : "a[href$='address_book']",
        yourAccount : "//span[text()='Your Account']"
    },
    readOnly: {
        customerProfile: "[id*='customer-profile'] b",
    },
    toastMsg: {
        address: "[data-action-type='DISMISS']"
    },
    button : {
        signIn : "[aria-label*='Sign in']",
        yourAddresses : "//h2[contains(text(),'Your Addresses')]"
    }
};

class Dashboard {
    constructor(page) {
        this.page = page;
    }
    async validateDashboardPage(){ // for test case 2 , 3 & 4
        console.log(await this.page.title());
        console.log(await this.page.url());

        await expect(this.page).toHaveURL("https://www.amazon.in");
    }
    async validateAmazonDashboardPage(){ // for test case 1
        console.log(await this.page.title());
        console.log(await this.page.url());
        
        // await expect(this.page).toHaveTitle('Amazon.com');
        await expect(this.page).toHaveURL('https://www.amazon.com/');
    }
    async enterSearchItem(item) {
        await this.page.locator(locator.input.searchBox).fill(item);
    }

    async clickOnSearch() {
        await this.page.locator(locator.input.searchBtn).click();
    }

    async dismissCountryAlert() {
        const dismissBtn = this.page.locator(locator.toastMsg.address);
        await dismissBtn.click();
    }

    async openAllCategory() {
        await this.page.locator(locator.link.allCategory).click();
        await expect(
            this.page.locator(locator.readOnly.customerProfile).first()
        ).toBeVisible();
    }
    async clickOnSelectCountry() {
        await this.page.mouse.wheel(0, 500);
        await expect(
            this.page.locator(locator.link.selectCountry).first()
        ).toBeVisible();
        await this.page.locator(locator.link.selectCountry).first().click();
    }
    async clickOnLocation(){
        const userAccount = await this.page.locator(locator.link.userAccount);
        await userAccount.waitFor({state : "visible"});
        await expect(userAccount).toBeVisible();
        await userAccount.click();
        await this.page.waitForLoadState('domcontentloaded');
        const yourAddresses = await this.page.locator(locator.button.yourAddresses);
        await expect(yourAddresses).toBeVisible();
        await yourAddresses.click();
    }
    async clickOnUserAccount(){
        await this.page.locator(locator.link.userAccount).click();
    }
    async clickOnSignBtn(){
        await expect(this.page.locator(locator.button.signIn)).toBeVisible();
        await this.page.locator(locator.button.signIn).click();
    }
    async clickOnAddAddressBtn(){
        await expect(this.page.locator(locator.link.addAddress)).toBeVisible();
        await this.page.locator(locator.link.addAddress).click();
    }
}
module.exports = Dashboard;
