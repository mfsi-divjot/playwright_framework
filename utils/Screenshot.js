class Screenshot{

    static async fullPage(page, name){
        await page.screenshot({
            path : `screenshots/${name}.png`,
            fullPage : true
        })
    }
    static async viewport(page, name){
        await page.screenshot ({
            path : `screenshots/${name}.png`
        })
    }
    static async element(locator, name){
        await locator.screenshot({
            path :`screenshots/${name}.png`
        })
    }
}
module.exports = Screenshot