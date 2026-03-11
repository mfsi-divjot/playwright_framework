const {expect} = require("@playwright/test")
const locator = {
    button : {
        threeDots : "[id='a-autoid-0-announce']",
        saveChanges : "//*[text()='Save Changes']",
        deleteBtn : "[name='submit.deleteItem']"
    },
    link : {

    },
    readOnly : {
        itemCount : "div[id^='itemMain']",
        itemName : "a[id^='itemName']",
        wishlistTitle : "[id*='entry-title']",
        deleteAlert : "//span[@class='a-size-medium']"
    },
    input : {
        searchBox : "#itemSearchTextInput",
        listName : "[name='listName']"
    },
    list : {
        manageList : "#editYourList"
    }

}
class Wishlist{
    constructor(page){
        this.page = page;
    }
    async validateCartCount(value){
        const item = await this.page.locator(locator.readOnly.itemCount);
        await item.first().waitFor();
        await expect(item).toHaveCount(value);
    }
    async searchandValidateItemInWishlist(item){
        // await this.page.waitForLoadState('domcontentloaded');
        const searchBox = await this.page.locator(locator.input.searchBox);
        await expect(searchBox).toBeVisible();
        await searchBox.fill(item);
        await searchBox.press('Enter');
        await this.page.locator(locator.readOnly.itemName).first().waitFor();
        await expect(this.page.locator(locator.readOnly.itemName)).toContainText(item);
    }
    async deleteAndValidateSearchedItem(){
        await expect(this.page.locator(locator.button.deleteBtn)).toBeVisible();
        await this.page.locator(locator.button.deleteBtn).click();
        // again click on search box and enter
        const searchBox = await this.page.locator(locator.input.searchBox);
        await expect(searchBox).toBeVisible();
        await searchBox.press('Enter');
        await expect(this.page.locator(locator.readOnly.deleteAlert)).toContainText("There are no items in this List. ");

    }
    async renameAndValidate(name){
        await this.page.locator(locator.button.threeDots).waitFor({state : 'visible'});
        await expect(this.page.locator(locator.button.threeDots)).toBeVisible();
        await this.page.locator(locator.button.threeDots).click();
        await expect(this.page.locator(locator.list.manageList)).toBeVisible();
        await this.page.locator(locator.list.manageList).click();
        await expect(this.page.locator(locator.input.listName)).toBeVisible();
        await this.page.locator(locator.input.listName).fill(name);
        await this.page.locator(locator.button.saveChanges).click();
        await this.page.waitForTimeout(3000);

        expect(this.page.locator(locator.readOnly.wishlistTitle)).toContainText(name);
    }  
}
module.exports = Wishlist