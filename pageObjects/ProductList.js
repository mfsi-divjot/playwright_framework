const {expect} = require('@playwright/test');

const locator = {
    link : {
        productLink : "//a[h2 and not(h2[contains(@aria-label, 'Sponsored')])]",
        price : "[id*='priceRefine'] a span"
    },
    readOnly : {
        productRate : "[cel_widget_id*='MAIN-SEARCH']>span .a-price-whole",
        productTitle : "[class*='top-small'] h2:not([aria-label*='Sponsored']) span",
        cartCount : "span#nav-cart-count",
        minPrice : "label[for*='lower-bound'] span",
        maxPrice : "label[for*='upper-bound'] span",
    },
    button : {
        addToCart : "[cel_widget_id*='MAIN-SEARCH']>span [aria-label='Add to cart']",
        cart : "[class~='nav-cart-icon']",
        filterIconOnMobile : "span[aria-label='All Filters Icon']",
        brandsOnMobile : "(//span[text()='Brands'])[1]",
        brandNameOnMobile : (name) => `[id*='brandsRefine'] a[aria-label*='${name}'] span`,
        priceAndDealsOnMobile : "(//span[text()='Price and Deals'])[1]",
        sortByOnMobile : "(//span[text()='Sort by'])[1]", 
        showResultsOnMobile : "a[class$='show-results'] span"
    },
    checkBox : { 
        brand : (brandName) =>`[id*='brandsRefine'] a[aria-label*='${brandName}'] i`, 
    },
    dropdown : {
        sortBy : "//span[text()='Sort by:']",
        sortByOption : (option)=> `//li/a[text()='${option}']`,
        sortByOptionOnMobile : (option) => `//div/span[text()='${option}']`,
        filterText : "//span[text()='Sort by:']/following-sibling::span"
    }
}
class ProductList {
    constructor(page){
        this.page = page
    }
     async isMobile() {
        const viewport = this.page.viewportSize();
        return viewport && viewport.width <= 768; // treat small width as mobile
    }
    async selectBrand(brandName){
        if(await this.isMobile()){
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.page.locator(locator.button.filterIconOnMobile)).toBeVisible();
        await this.page.locator(locator.button.filterIconOnMobile).click();
        await expect(this.page.locator(locator.button.brandsOnMobile)).toBeVisible();

        await this.page.locator(locator.button.brandsOnMobile).click();
        const brandType = await this.page.locator(locator.button.brandNameOnMobile(brandName));
        await brandType.click();
        await this.page.waitForTimeout(3000);
        }
        else{
        const brandLocator = this.page.locator(locator.checkBox.brand(brandName));
        await expect(brandLocator).toBeVisible();
        await brandLocator.check();
        await expect(brandLocator).toBeChecked();
        }
    }
    async selectPriceRangeOption(index){
        if(await this.isMobile()){
        await expect(this.page.locator(locator.button.priceAndDealsOnMobile)).toBeVisible();
        await this.page.locator(locator.button.priceAndDealsOnMobile).click();

        await this.page.locator(locator.link.price).nth(index+1).click();
        }
        else{
        const priceLocator = await this.page.locator(locator.link.price).nth(index);
        await expect(priceLocator).toBeVisible();
        await priceLocator.click();
        }
    }
    async selectSortOption(option){
        if(await this.isMobile()){
            await this.page.evaluate(()=>{
                window.scrollTo(0, document.body.scrollHeight);
            })
            const sortByBtn = await this.page.locator(locator.button.sortByOnMobile);
            await expect(sortByBtn).toBeVisible();
            await sortByBtn.click();

            const filterOption = await this.page.locator(locator.dropdown.sortByOptionOnMobile(option));
            await expect(filterOption).toBeVisible();
            await filterOption.click();

            const showResultBtn = await this.page.locator(locator.button.showResultsOnMobile);
            await expect(showResultBtn).toBeVisible();
            await showResultBtn.click();
        }
        else{
        const sortByBtn = this.page.locator(locator.dropdown.sortBy);
        await expect(sortByBtn).toBeVisible();
        await sortByBtn.click();

        const filterOption = await this.page.locator(locator.dropdown.sortByOption(option));
        await expect(filterOption).toBeVisible();
        await filterOption.click();
        }
    }
    async validateTitle(brandName){
        const itemTitle = await this.page.locator(locator.readOnly.productTitle);

        // wait for first element to load
        await itemTitle.first().waitFor();
        const count = await itemTitle.count();
        for(let i=0; i<count; i++){
            let title = await itemTitle.nth(i).textContent();
            await expect.soft(title.toLowerCase(),
            `Brand Name mismatch : ${title} at position ${i+1} doesn't contains ${brandName}`)
            .toContain(brandName.toLowerCase()); // toEqual
        }
    }
    async getPriceRange(){
        // get min price & convert to number
        const minPriceValue = await this.page.locator(locator.readOnly.minPrice);
        const minPriceText = await minPriceValue.textContent();
        const finalMinPrice = Number(minPriceText.replace(/[^\d]/g, ''));
        console.log(`minimum price : ${finalMinPrice}`);

        // get max price & convert to number
        const maxPriceValue = await this.page.locator(locator.readOnly.maxPrice);
        const maxPriceText = await maxPriceValue.textContent();
        const finalMaxPrice = Number(maxPriceText.replace(/[^\d]/g, ''));
        console.log(`maximum price : ${finalMaxPrice}`);

        return {finalMinPrice, finalMaxPrice}
    }
    async validatePrice(finalMinPrice, finalMaxPrice){ 
        const itemTitle = await this.page.locator(locator.readOnly.productTitle);

        const itemPrice = await this.page.locator(locator.readOnly.productRate);
        // wait for 1st element to load
        await itemPrice.first().waitFor();
        const count = await itemPrice.count();
        for(let i=0; i<count; i++){
            let title = await itemTitle.nth(i).textContent();
            const price = await itemPrice.nth(i).textContent();
            const finalPrice = Number(price.replace(/,/g, ''));
            
            await expect.soft(
                finalPrice,
                `Price mismatch: "${title}" at position ${i + 1} with price ${price} is outside range (${finalMinPrice} - ${finalMaxPrice})`
            ).toBeGreaterThanOrEqual(finalMinPrice);

            await expect.soft(
                finalPrice,
                `Price mismatch: "${title}" at position ${i + 1} with price ${price} is outside range (${finalMinPrice} - ${finalMaxPrice})`
            ).toBeLessThanOrEqual(finalMaxPrice);
        }
    }
    async validateSortOption(filterName){
        // get all product price
        const itemValue = await this.page.locator(locator.readOnly.productRate);
        await itemValue.nth(0).waitFor();
        const priceOfItem = await itemValue.allTextContents();
        const finalPrice = priceOfItem.map(text => Number((text || '').replace(/[^\d]/g, '')));

        // compare
        if(filterName==='Price: Low to High'){
            for(let i=1; i<finalPrice.length; i++){
                if(finalPrice[i]<finalPrice[i-1]){
                    await expect.soft(
                    finalPrice[i],
                    `Sort mismatch: item at position ${i + 1} (${finalPrice[i]}) is less than previous (${finalPrice[i - 1]})`
                ).toBeGreaterThanOrEqual(finalPrice[i - 1]);
        
                }
            }
        }
        else if(filterName==='Price: High to Low'){
            for(let i=1; i<finalPrice.length; i++){
                if(finalPrice[i]>finalPrice[i-1]){
                     await expect.soft(
                    finalPrice[i],
                    `Sort mismatch: item at position ${i + 1} (${finalPrice[i]}) is greater than previous (${finalPrice[i - 1]})`
                ).toBeLessThanOrEqual(finalPrice[i - 1]);
                }
            }
        }
        else{
            console.log(`Filter : ${filterName} not supported for validation`);
        }
    }
    async addItemToCartOption(index){
        const firstItem = await this.page.locator(locator.button.addToCart).nth(index);
        await expect(firstItem).toBeVisible();
        await firstItem.scrollIntoViewIfNeeded();
        await firstItem.click();
    }
    async validateCartCount(value){
        await expect(this.page.locator(locator.readOnly.cartCount)).toHaveText(value);
    }
    async openProductDetailOption(index) {
        const title = this.page.locator(locator.link.productLink).nth(index);
        await title.evaluate(el => el.removeAttribute('target')); 
        await expect(title).toBeVisible();
        await title.click();
    }

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
}
module.exports = ProductList;