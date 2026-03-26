const {expect} = require('@playwright/test')

class BookingService{
    constructor(request){
        this.request = request
    }
    async getBookingId(token){
        const response = await this.request.get('/booking',{
            headers : {
                Authorization : `Bearer ${token}`
            }
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        console.log(body);
        return body;
    }
    async getBooking(secondBookingId){
        const response = await this.request.get(`/booking/${secondBookingId}`, {
            headers : {
                'Accept' : 'application/json'
            }
        })
        const body = await response.json();
        return body;
    }
    
    async getBookingAfterDelete(id){
        const response = await this.request.get(`/booking/${id}`, {
            headers : {
                'Accept' : 'application/json'
            }
        })
        expect(response.status()).toBe(404);
    }
    async createBooking(payload){
        const response = await this.request.post('/booking', {
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            data : payload
        })
        return response;
    }
    
    async updateBooking(token, id){
        const response = await this.request.put(`/booking/${id}`, {
            headers : {
                'Content-Type' : 'application/json',
                'Accept' : 'application/json',
                'Cookie' : `token=${token}`
            },
            data : {
                "firstname" : "James",
                "lastname" : "Brown",
                "totalprice" : 111,
                "depositpaid" : true,
                "bookingdates" : {
                    "checkin" : "2018-01-01",
                    "checkout" : "2019-01-01"
                },
                "additionalneeds" : "Breakfast"
            }
        })
        const header = await response.headers();
        console.log(header);
        expect(response.status()).toBe(200);
        expect(header['content-type']).toContain('application/json')
        const body = await response.json();
        return body;
    }
    async partialUpdateBooking(token, id){
        const response = await this.request.patch(`booking/${id}`,{
            headers : {
                'Content-Type' : 'application/json',
                'Accept' : 'application/json',
                'Cookie' : `token=${token}`
            },
            data : {
                "firstname" : "Jamis",
                "lastname" : "Brown",
            }
        })
        const header = await response.headers();
        console.log(header);
        expect(response.status()).toBe(200);
        expect(header['content-type']).toContain('application/json');
        const body = await response.json();
        return body;
    }
    async deleteBooking(token, id){
        const response = await this.request.delete(`/booking/${id}`,{
            headers : {
                'Content-Type' : 'application/json',
                'Cookie' : `token=${token}`
            }
        })
        expect(response.status()).toBe(201);
    } 
}

module.exports = BookingService