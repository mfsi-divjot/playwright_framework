class UpdateAddress{

    constructor(page){
        this.page = page,

        this.container = {
            updateAddress : page.getByText("Update address")
            
        }
    }
    async clickUpdateAddress(){   
        await this.container.updateAddress.click();
    }
}