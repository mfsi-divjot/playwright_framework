const {expect} = require('@playwright/test')

class AuthService {
    constructor(request){
        this.request = request;
    }
    async createToken (user , pass){
        const response = await this.request.post('/auth', {
            headers : {
                'Content-Type' : 'application/json'
            },
            data : {
                "username" : user,
                'password' : pass
            }
        })
        expect(response.status()).toBe(200);
        // const body = await response.json();
        // const token = body.token;
        // return token;
        const body = await response.json();
        return body;
    }
}
module.exports = AuthService;