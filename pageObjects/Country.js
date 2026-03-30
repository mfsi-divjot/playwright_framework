const { expect } = require('@playwright/test');

const locators = {
    dropdown: {
        country: "[data-action*='dropdown-button']",
        countryOption: (countryText) => `//a[text()='${countryText}']`
    },
    scrollArea: {
        countryList : "[class*='vertical-scroll']",
    },
    readOnly: {
        countryName: "[data-action*='dropdown-button'] span",
        selectedCountry: "[aria-label*='country/region'] span:nth-child(2)"
    },
    button : {
        goToWebsite: "input[type='submit']+span"
    }
};

class Country{
    constructor(page) {
        this.page = page;
    }
    async selectCountry(countryText) {
        await expect(this.page.locator(locators.dropdown.country)).toBeVisible();
        await this.page.locator(locators.dropdown.country).click();

        // scroll country container to top
        const countryContainer = this.page.locator(locators.scrollArea.countryList);
        await countryContainer.evaluate(e1 => {
            e1.scrollTop = e1.scrollHeight;
        });
        const countryLocator = await this.page.locator(locators.dropdown.countryOption(countryText));
        await expect(countryLocator).toBeVisible();
        await countryLocator.click();

        await expect(this.page.locator(locators.readOnly.countryName)).toBeVisible();
    }
    async clickOnGoToWebsite() {
            //shift focus to new tab
            const page1Promise = this.page.waitForEvent('popup');
            await this.page.locator(locators.button.goToWebsite).click({ force: true })
            const page1 = await page1Promise;
            await page1.waitForLoadState('domcontentloaded');
            return page1;
    }
    async validateCountryName(countryName){
        // scroll till bottom of page
        await this.page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });
        console.log(await this.page.locator(locators.readOnly.selectedCountry).textContent());
        await expect(this.page.locator(locators.readOnly.selectedCountry)).toHaveText(countryName);
    }
}
module.exports = Country;
