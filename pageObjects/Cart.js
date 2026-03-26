const {expect} = require('@playwright/test')
const locator = {
    button : {
        countIncrement : "[class*='small-add']",
        countDecrement : "span[data-a-selector^='decrement']",
        removeBtn : "[class$='remove']"
    },
    readOnly : {
        itemCount : "[data-a-selector='inner-value']",
        items : "li[class*='title']",
        totalItems : "span[id*='label-activecart']",
        itemPrice : "[class~='sc-product-price'] [aria-hidden='true']",
        totalPrice : "[id*='amount-active'] span",
        cartCount : "[id$='activecart']"
    }
}
class Cart {
    constructor(page){
        this.page = page;
    }
    async increaseItemByOneOption(index){
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.page.locator(locator.button.countIncrement).nth(index)).toBeVisible();
        await this.page.locator(locator.button.countIncrement).nth(index).click();
    }
    async validateItemCount(value){
        await expect(this.page.locator(locator.readOnly.itemCount).first()).toHaveText(value);
    }
    async decreaseItemByOneOption(index){
        await expect(this.page.locator(locator.button.countDecrement).nth(index)).toBeVisible();
        await this.page.locator(locator.button.countDecrement).nth(index).click();
        await this.page.waitForTimeout(2000); // some delay is required for test to pass
    }
    async validateItemDeleted(index){
        await expect(this.page.locator(locator.button.countDecrement).nth(index)).not.toBeVisible();
    }
    
    async sumAndvalidateTotalItemsPrice(finalTotalPrice){ 
        let sum=0;
        const price = await this.page.locator(locator.readOnly.itemPrice);
        await expect(price.first()).toBeVisible();
        const count = await price.count();
        for(let i=0; i<count; i++){
            const productPrice = await price.nth(i).textContent();
            const finalProductPrice = Number(productPrice.replace(/[₹,]/g, '').split('.')[0]);
            sum+=finalProductPrice;
        }
        console.log('Sum of total items : ',sum);
        console.log(`Total Price : ${finalTotalPrice}`);
        await expect(finalTotalPrice).toBe(sum);
    }
    async getTotalPrice(){
        const totalPriceLocator = await this.page.locator(locator.readOnly.totalPrice).textContent();
        const finalTotalPrice = await Number(totalPriceLocator.replace(/[₹,]/g, '').split('.')[0]);
        return finalTotalPrice;
    }
    async removeAllItemsFromCart(){
        const removeItem = await this.page.locator(locator.button.removeBtn);
        await expect(removeItem).toBeVisible();
        await removeItem.click();
        await expect(this.page.locator(locator.button.countDecrement)).toBeVisible();
        await this.page.locator(locator.button.countDecrement).click();
    }
    async validateCartItemText(text){
        await expect(this.page.locator(locator.readOnly.cartCount).first()).toContainText(text);
    }
}
module.exports = Cart
                            