const {expect} = require("@playwright/test")
const locator = {
    button : {
        // threeDots : "[id='a-autoid-0-announce']",
        saveChanges : "//*[text()='Save Changes']",
        deleteBtn : "[name='submit.deleteItem']",
        moreOptions : "[aria-label='More Options']"
    },
    readOnly : {
        itemCount : "div[id^='itemMain']",
        itemName : "a[id^='itemName']",
        wishlistTitle : "[id*='entry-title']",
        deleteAlert : "//span[@class='a-size-medium']",
        wishlistName : "[id*='entry-title']"
    },
    input : {
        searchBox : "#itemSearchTextInput",
        listName : "[name='listName']"
    },
    list : {
        manageList : "a#editYourList"
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
    async searchItemInWishlist(item){
        const searchBox = await this.page.locator(locator.input.searchBox);
        await expect(searchBox).toBeVisible();
        await searchBox.fill(item);
        await searchBox.press('Enter');
        await this.page.locator(locator.readOnly.itemName).first().waitFor();
    }
    async validateSearchedItem(item){
        await expect(this.page.locator(locator.readOnly.itemName)).toContainText(item);
    }
    async deleteSearchedItem(){
        await expect(this.page.locator(locator.button.deleteBtn)).toBeVisible();
        await this.page.locator(locator.button.deleteBtn).click();

        // again click on search box and enter
        const searchBox = await this.page.locator(locator.input.searchBox);
        await expect(searchBox).toBeVisible();
        await searchBox.press('Enter');
    }
    async validateItemDeleted(text){
        await expect(this.page.locator(locator.readOnly.deleteAlert)).toContainText(text);
    } 
    async emptyWishlist(){
        // clear item search in searchbox
        const searchBox = this.page.locator(locator.input.searchBox);
        await expect(searchBox).toBeVisible();

        await searchBox.click();
        await searchBox.press('Control+A');  
        await searchBox.press('Backspace');
        await searchBox.press('Enter');

        const deleteFirstItem = await this.page.locator(locator.button.deleteBtn).first();
        const deleteSecondItem = await this.page.locator(locator.button.deleteBtn).nth(1);
        await expect(deleteFirstItem).toBeVisible();
        await deleteFirstItem.click();
        await expect(deleteSecondItem).toBeVisible();
        await deleteSecondItem.click();
    }
    async openManageList(){
        const options = await this.page.locator(locator.button.moreOptions);
        await expect(options).toBeVisible();
        await options.click();

        const manageUserList = await this.page.locator(locator.list.manageList);
        await expect(manageUserList).toBeVisible();
        await manageUserList.click();
    }
    async renameWishlistName(name){
        const username = await this.page.locator(locator.input.listName);
        await expect(username).toBeVisible();
        await username.fill(name);

        await expect(this.page.locator(locator.button.saveChanges)).toBeVisible();
        await this.page.locator(locator.button.saveChanges).click({force:true});
    }
    async validateWishlistName(name){
        await expect(this.page.locator(locator.readOnly.wishlistName)).toHaveText(name);
    }
}
module.exports = Wishlist