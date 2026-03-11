const {expect} = require('@playwright/test')
const locator = {
    button : {
        countIncrement : "[class*='small-add']",
        countDecrement : "[class*='small-trash']"
    },
    readOnly : {
        itemCount : "[data-a-selector='inner-value']",
        items : "li[class*='title']",
        totalItems : "span[id*='label-activecart']",
        itemPrice : "[class~='sc-product-price'] [aria-hidden='true']",
        totalPrice : "[id*='amount-active'] span"
    }
}
class Cart {
    constructor(page){
        this.page = page;
    }
    async increaseQuantityByOne(){ // make index dynamic
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.page.locator(locator.button.countIncrement).first()).toBeVisible();
        await this.page.locator(locator.button.countIncrement).first().click();
        await expect(this.page.locator(locator.readOnly.itemCount).first()).toHaveText('2');
    }
    async decreaseQuantityByOne(){ // make index dynamic
        await this.page.locator(locator.button.countDecrement).last().click();
    }
    async validateItemCount(){ // fetch number value & compare completely
        const item = await this.page.locator(locator.readOnly.items);
        const itemCount = await item.count();

        const totalItemInCart = await this.page.locator(locator.readOnly.totalItems);
        await expect(totalItemInCart).toContainText(itemCount.toString());
    }
    async validateItemPrice(){ // getAndValidateItemPrice
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

        // validate
        const totalPriceLocator = await this.page.locator(locator.readOnly.totalPrice).textContent();
        const finalTotalPrice = await Number(totalPriceLocator.replace(/[₹,]/g, '').split('.')[0]);
        console.log('Given toal price : ', finalTotalPrice);
        await expect(finalTotalPrice).toBe(sum);
    }
}
module.exports = Cart
                            