const {expect} = require('@playwright/test')
const {user} = require('../testData/UserData')

const locator = {
    container : {
        addAddress : 'Add address',
    },
    input : {
        fullname : "[name*='FullName']",
        phoneNumber : "[name*='PhoneNumber']",
        pinCode : "[id$='PostalCode']",
        houseNumber : "[id$='Line1']",
        villageName : "[id$='Line2']",
        landMark : "[id$='landmark']",
        cityName : "[id*='city']",
        stateName : "select[name*='State']"
    },
    button : {
        submit : "//span[text()='Add address']",
        editAddress : "a[id*='edit-btn']",
        updateAddress : "Update address",
        removeAddress : "(//a[contains(@id,'delete-btn')])",
        deleteBtn : "[id$='2-submit-btn'] span[id*='delete']"
    },
    readOnly : {
        successMsg : " h4.a-alert-heading",
        fullName : "[id$='FullName']",
        houseNo : "[id$='AddressLineOne']",
        village : "[id$='AddressLineTwo']",
        phoneNumber : "[id$='PhoneNumber']",
        pinCode : "[id$='PostalCode']" 
    },
    checkbox : {
        defaultAddress : "[type='checkbox']"
    }
}
class Address {
    constructor(page){
        this.page = page
    }
    async clickOnAddAddress(){
        await expect(this.page.getByText(locator.container.addAddress)).toBeVisible();
        await this.page.getByText(locator.container.addAddress).click()
    }
    async enterUserDetails(user){
        await this.page.locator(locator.input.fullname).fill(user.name);
        await this.page.locator(locator.input.phoneNumber).fill(user.number);
        await this.page.locator(locator.input.pinCode).fill(user.code);
        await this.page.waitForTimeout(4000);
        await this.page.locator(locator.input.houseNumber).fill(user.houseNo);
        await this.page.locator(locator.input.villageName).fill(user.village);
        await this.page.locator(locator.input.landMark).fill(user.landmark);
        await expect(this.page.getByText(locator.container.addAddress)).toBeVisible();
        await this.page.getByText(locator.container.addAddress).click({force : true});
        await this.page.waitForTimeout(4000);
    }
    
    async validateAddress(message){
        await expect(this.page.locator(locator.readOnly.successMsg).first()).toHaveText(message);
    }
    async validateLastAddedAddress(user){
        await expect(this.page.locator(locator.readOnly.fullName).nth(4)).toHaveText(user.name);
        await expect(this.page.locator(locator.readOnly.houseNo).nth(4)).toHaveText(user.houseNo);
        await expect(this.page.locator(locator.readOnly.village).nth(4)).toHaveText(user.village);
        await expect(this.page.locator(locator.readOnly.pinCode).nth(4)).toContainText(user.code);
        await expect(this.page.locator(locator.readOnly.phoneNumber).nth(4)).toContainText(user.number);
    }
    async updateUsernameInLastAddress(name){
        await this.page.locator(locator.button.editAddress).last().click();
        await this.page.locator(locator.input.fullname).fill(name);
        await this.page.getByText(locator.button.updateAddress).scrollIntoViewIfNeeded();
        await this.page.getByText(locator.button.updateAddress).click({force : true});
    }
    async validateUpdateUsernameInLastAddress(name){
        await expect(this.page.locator(locator.readOnly.fullName).nth(3)).toHaveText(name);
    }
    async removeLastAddress(){
        await this.page.locator(locator.button.removeAddress).last().click();
        await this.page.waitForTimeout(2000);
        await this.page.keyboard.press('Tab');
        await this.page.keyboard.press('Tab');
        await this.page.waitForTimeout(2000);
        await this.page.keyboard.press('Enter');
    }
    async validateLastAddressDeleted(name){
       const allNames = await this.page.locator(locator.readOnly.fullName).allTextContents();
       expect(allNames).not.toContain(name); 
    }
}
module.exports = Address