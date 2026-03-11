const {expect} = require('@playwright/test');

const locator = {
    input : {
        minPrice : "label[for*='lower-bound'] span",
        maxPrice : "label[for*='upper-bound'] span",
    },
    link : {
        productLink : "//a[h2 and not(h2[contains(@aria-label, 'Sponsored')])]",
        price : "[id*='priceRefine'] a span"
    },
    readOnly : {
        productRate : "[cel_widget_id*='MAIN-SEARCH']>span .a-price-whole",
        productTitle : "[class*='top-small'] h2:not([aria-label*='Sponsored']) span",
        cartCount : "span#nav-cart-count"
    },
    button : {
        addToCart : "[cel_widget_id*='MAIN-SEARCH']>span [aria-label='Add to cart']",
        cart : "[class~='nav-cart-icon']",
        filterIcon : "span[aria-label='All Filters Icon']",
        brands : "(//span[text()='Brands'])[1]",
        brandName : (name) => `[id*='brandsRefine'] a[aria-label*='${name}'] span`,
        priceAndDeals : "(//span[text()='Price and Deals'])[1]",
        showResults : "a[class$='show-results'] span"

    },
    checkBox : { 
        brand : (brandName) =>`[id*='brandsRefine'] a[aria-label*='${brandName}'] i`, 
    },
    heading : {
        
    },
    dropdown : {
        sortBy : "[data-action*='dropdown-b']",
        sortByOption : (option)=> `(//a[text()='${option}'])[2]`
    }
}
class ProductList {
    constructor(page){
        this.page = page
    }
    async selectBrand(brandName){
        const brandLocator = this.page.locator(locator.checkBox.brand(brandName));
        await expect(brandLocator).toBeVisible();
        await brandLocator.check();
        await expect(brandLocator).toBeChecked();
    }
    async selectPriceRange(){
        const priceLocator = await this.page.locator(locator.link.price).nth(1);
        await priceLocator.click();
    }
    async validateTitle(brandName){
        const itemTitle = await this.page.locator(locator.readOnly.productTitle);

        // wait for first element to load
        await itemTitle.first().waitFor();
        const count = await itemTitle.count();
        for(let i=0; i<count; i++){
            let title = await itemTitle.nth(i).textContent();
            if(!title.toLowerCase().includes(brandName.toLowerCase())){
                console.log(`Brand Name mismatch : ${title} at position ${i+1} doesn't contains ${brandName}`)
            }
        }
    }
    async selectSortOption(option){
        await expect(this.page.locator(locator.dropdown.sortBy)).toBeVisible();
        await this.page.locator(locator.dropdown.sortBy).click();
        const sortByOptionLocator = await this.page.locator(locator.dropdown.sortByOption(option));
        await expect(sortByOptionLocator).toBeVisible();
        await sortByOptionLocator.mouse.hower();
        await sortByOptionLocator.click();
    }
    async validatePrice(){
        const itemPrice = await this.page.locator(locator.readOnly.productRate);
        // wait for 1st element to load
        await itemPrice.first().waitFor();
        const count = await itemPrice.count();
        for(let i=0; i<count; i++){
            const price = await itemPrice.nth(i).textContent();
            console.log(price);
        }
    }
    async addItemToCart(index){
        const firstItem = await this.page.locator(locator.button.addToCart).nth(index);
        await expect(firstItem).toBeVisible();
        await firstItem.scrollIntoViewIfNeeded();
        await firstItem.click();
        await expect(this.page.locator(locator.readOnly.cartCount)).toHaveText('1');
    }
    async openProductDetail(index) {
        const title = this.page.locator(locator.link.productLink).nth(index);
        await title.evaluate(el => el.removeAttribute('target')); 
        await expect(title).toBeVisible();
        await title.click();
    }
    // async openFirstProductDetail(){
    //     await this.openProductDetail(0);
    // }
    // async openSecondProductDetail(){
    //     await this.openProductDetail(1);
    // }
    // async openThirdProductDetail(){
    //     await this.openProductDetail(2);
    // }
    async clickOnCart(){
        await expect(this.page.locator(locator.button.cart)).toBeVisible();
        await this.page.locator(locator.button.cart).click();
    }
    async getProductInfo(index) {
        const productTitleLocator = this.page.locator(locator.readOnly.productTitle).nth(index);
        const productPriceLocator = this.page.locator(locator.readOnly.productRate).nth(index);

        const title = (await productTitleLocator.textContent()).trim();
        const priceText = await productPriceLocator.textContent();
        const price = Number(priceText.replace(/[₹,+\s]/g, ''));

        return { title, price };
    }
    async selectBrandName(name){ // for mobile
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.page.locator(locator.button.filterIcon)).toBeVisible();
        await this.page.locator(locator.button.filterIcon).click();

        await expect(this.page.locator(locator.button.brands)).toBeVisible();
        await this.page.locator(locator.button.brands).click();
        const brandType = await this.page.locator(locator.button.brandName(name));
        await brandType.click();
    }
    async chooseFirstPrice(){ // for mobile
        await expect(this.page.locator(locator.button.priceAndDeals)).toBeVisible();
        await this.page.locator(locator.button.priceAndDeals).click();

        await this.page.locator(locator.link.price).nth(2).click();
    }
    async clickOnShowResults(){ // for mobile
        await this.page.locator(locator.button.showResults).click();
    }
}
module.exports = ProductList;