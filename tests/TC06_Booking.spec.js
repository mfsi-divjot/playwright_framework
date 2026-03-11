const {test} = require('@playwright/test')
const AuthService = require('../api-request/AuthService');
const BookingService = require('../api-request/BookingService.js');
const {createBooking, updateBooking, partialUpdate} = require('../testData/BookingInfo.js')

let token, bookingId;

test.beforeAll(async({request})=>{
    const authService = new AuthService(request);
    token = await authService.createToken ('admin', 'password123');
})

test('Booking API Flow', async({request})=>{
    const bookingService = new BookingService(request);
    bookingId = await bookingService.getBookingId(token);
    await bookingService.getBooking(bookingId);

    const newBookingId = await bookingService.createBooking(createBooking);
    await bookingService.updateBooking(token, newBookingId, updateBooking);
    await bookingService.partialUpdateBooking(token, newBookingId, partialUpdate);
    await bookingService.deleteBooking(token, newBookingId);

})