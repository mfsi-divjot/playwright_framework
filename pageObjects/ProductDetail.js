const {expect} = require('@playwright/test')

const locators = {
    readOnly : {
        productTitle : "span#productTitle",
        productPrice : "[class~='priceToPay'] [class$='whole']"
    },
    button : {
        addToCart : "//*[text()='Add to cart']",
        wishlist : "[aria-label='Add to Wish List']",
        goToWishlist : "View Your List"
    },
    link : {
        cart : "a#nav-cart"
    }
}
class ProductDetail{
    constructor(page){
        this.page = page
    }
    async validateProductTitle(expectedTitle){
        console.log(await this.page.locator(locators.readOnly.productTitle).textContent());
        await expect(this.page.locator(locators.readOnly.productTitle)).toHaveText(expectedTitle);
    }
    async validateProductPrice(expectedPrice){
        const priceText = (await this.page.locator(locators.readOnly.productPrice).textContent()).trim();
        const price = Number(priceText.replace(/[₹,+\s]/g,''));
        console.log("Detail Page Price:", price);
        await expect(price).toBe(expectedPrice);
    }
    async clickOnAddToCart(){
        await this.page.locator(locators.button.addToCart).last().click({force: true});
    }
    async goToCart(){
        await this.page.locator(locators.link.cart).click();
    }
    async getProductInfo(){
        const productTitle = await this.page.locator(locators.readOnly.productTitle);
        const productRate = await this.page.locator(locators.readOnly.productPrice);

        const title = (await productTitle.textContent()).trim();
        const priceText = await productRate.textContent();
        const price = Number(priceText.replace(/[₹,+\s]/g, ''));

        return { title, price };
    }
    async addToWishlist(){
        await this.page.waitForLoadState('domcontentloaded')
        await expect(this.page.locator(locators.button.wishlist)).toBeVisible();
        await this.page.locator(locators.button.wishlist).click();
    }
    async goBack(){
        // Ensure we go back safely only if page can navigate
        await this.page.goBack({ waitUntil: 'domcontentloaded'});
        await this.page.waitForLoadState('domcontentloaded');
    }
    async gotToWishlist(){
        const wishlist = await this.page.getByText(locators.button.goToWishlist);
        await expect(wishlist).toBeVisible();
        await wishlist.click();
    }
}
module.exports = ProductDetail