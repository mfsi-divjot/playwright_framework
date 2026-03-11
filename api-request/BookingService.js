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
        const secondBookingId = await body[1].bookingid;
        return secondBookingId;
    }
    async getBooking(secondBookingId){
        const response = await this.request.get(`/booking/${secondBookingId}`, {
            headers : {
                'Accept' : 'application/json'
            }
        })
        expect(response.status()).toBe(200);
        const body = await response.json();
        console.log(body);
        expect(body).toHaveProperty('firstname');
        expect(body).toHaveProperty('depositpaid');
        expect(body.bookingdates).toHaveProperty('checkout');
        expect(body.depositpaid).toBe(true);
        expect(typeof body.bookingdates).toBe('object');
    }
    async createBooking(payload){
        const response = await this.request.post('/booking', {
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            data : payload
        })
        expect(response.status()).toBe(200);
        const body = await response.json();
        console.log(body);
        const header = await response.headers();
        console.log(header);
        expect(header['content-type']).toContain('application/json');
        return body.bookingid;
    }
    async updateBooking(token, id, payload){
        const response = await this.request.put(`/booking/${id}`, {
            headers : {
                'Content-Type' : 'application/json',
                'Accept' : 'application/json',
                'Cookie' : `token=${token}`
            },
            data : payload
        })
        const body = await response.json();
        console.log(body);
        const header = await response.headers();
        console.log(header);
        expect(response.status()).toBe(200);
        expect(body.firstname).toBe('James');
        expect(body.bookingdates).toHaveProperty('checkout');
        expect(typeof body.depositpaid).toBe('boolean');
        expect(header['content-type']).toContain('application/json')
    }
    async partialUpdateBooking(token, id, payload){
        const response = await this.request.patch(`booking/${id}`,{
            headers : {
                'Content-Type' : 'application/json',
                'Accept' : 'application/json',
                'Cookie' : `token=${token}`
            },
            data : payload
        })
        const body = await response.json();
        console.log(body);
        const header = await response.headers();
        console.log(header);
        expect(response.status()).toBe(200);
        expect(header['content-type']).toContain('application/json');
        expect(body.firstname).toBe('Jamis');
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