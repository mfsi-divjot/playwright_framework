const {expect} = require('@playwright/test')
const Screenshot = require('../utils/Screenshot')

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
    async enterUserDetails(username, contact, postalCode, houseNo, village, landmark){
        await this.page.locator(locator.input.fullname).fill(username);
        await this.page.locator(locator.input.phoneNumber).fill(contact);
        await this.page.locator(locator.input.pinCode).fill(postalCode);
        await this.page.waitForTimeout(4000);
        await this.page.locator(locator.input.houseNumber).fill(houseNo);
        await this.page.locator(locator.input.villageName).fill(village);
        await this.page.locator(locator.input.landMark).fill(landmark);
        await expect(this.page.getByText(locator.container.addAddress)).toBeVisible();
        await this.page.getByText(locator.container.addAddress).click({force : true});
        await this.page.waitForTimeout(4000);
    }
    
    async validateAddress(message){
        await expect(this.page.locator(locator.readOnly.successMsg).first()).toHaveText(message);
    }
    async validateLastAddressDetails(name, houseNo, village, pinCode, contactNo){
        await expect(this.page.locator(locator.readOnly.fullName).nth(4)).toHaveText(name);
        await expect(this.page.locator(locator.readOnly.houseNo).nth(4)).toHaveText(houseNo);
        await expect(this.page.locator(locator.readOnly.village).nth(4)).toHaveText(village);
        await expect(this.page.locator(locator.readOnly.pinCode).nth(4)).toContainText(pinCode);
        await expect(this.page.locator(locator.readOnly.phoneNumber).nth(4)).toContainText(contactNo);
    }
    async updateUsernameInLastAddress(name){
        await this.page.locator(locator.button.editAddress).last().click();
        await this.page.locator(locator.input.fullname).fill(name);
        await this.page.getByText(locator.button.updateAddress).scrollIntoViewIfNeeded();
        await this.page.getByText(locator.button.updateAddress).click({force : true});
    }
    async validateUpdateUsernameInLastAddress(name){
        await expect(this.page.locator(locator.readOnly.fullName).nth(3)).toHaveText(name);
        // await Screenshot.element(this.page.locator(locator.readOnly.fullName).nth(3), 'Validate Address Update');
        // await expect(this.page.locator(locator.readOnly.fullName).nth(3)).toHaveScreenshot({name : "address updated.png"});
    }
    async removeLastAddress(){
        await this.page.locator(locator.button.removeAddress).last().click();
        await this.page.waitForTimeout(2000);
        await this.page.keyboard.press('Tab');
        await this.page.keyboard.press('Tab');
        await this.page.waitForTimeout(2000);
        await this.page.keyboard.press('Enter');

    }
}
module.exports = Address