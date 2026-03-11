const {expect} = require('@playwright/test')
const locator = {
    input : {
        userEmail : "[type='email']",
        password : "[name='password']"
    },
    button : {
        continueBtn : "[type='submit']",
        signIn : '#signInSubmit'
    },
    readOnly : {
        accountName : "span[id*='accountList']"
    }
}
class SignInPage{
    constructor(page){
        this.page = page;
    }
    async enterEmail(email){
        await this.page.locator(locator.input.userEmail).fill(email);
    }
    async clickContinue(){
        await this.page.locator(locator.button.continueBtn).click();
    }
    async enterPassword(password){
        await this.page.locator(locator.input.password).fill(password);
    }
    async clickSignIn(){
        await this.page.locator(locator.button.signIn).click();
    }
    async validateUserLogin(username){
        await expect(this.page.locator(locator.readOnly.accountName)).toHaveText(`Hello, ${username}`)
    }
}
module.exports = SignInPage