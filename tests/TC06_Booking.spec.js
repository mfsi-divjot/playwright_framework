const {test, expect} = require('@playwright/test')
const AuthService = require('../api-request/AuthService');
const BookingService = require('../api-request/BookingService.js');
const {createBooking} = require('../testData/BookingInfo.js')

let token, bookingIds;

test.beforeAll(async({request})=>{
    const authService = new AuthService(request);
    const getToken = await authService.createToken ('admin', 'password123');
    token = getToken.token;
    expect(getToken).toHaveProperty('token');
})

test('Booking API Flow', async({request})=>{
    const bookingService = new BookingService(request);
    const getBookingIds = await bookingService.getBookingId(token);
    bookingIds = await getBookingIds[1].bookingid;

    //  get booking id
    const bookingId =  await bookingService.getBooking(bookingIds);
    expect(bookingId).toHaveProperty('firstname');
    expect(bookingId).toHaveProperty('depositpaid');
    expect(bookingId.bookingdates).toHaveProperty('checkout');
    expect(bookingId.depositpaid).toBe(true);
    expect(typeof bookingId.bookingdates).toBe('object');

    //create booking id
    const createBookingId = await bookingService.createBooking(createBooking);
    const newBookingId = await createBookingId.bookingid;
    expect(createBookingId.booking).toHaveProperty('totalprice');
    expect(createBookingId.booking.bookingdates).toHaveProperty('checkout');
    expect(createBookingId.booking.firstname).toBe('Jim');
    expect(typeof createBookingId.booking.bookingdates).toBe('object');

    const updateBookingPayload = {
        ...createBooking, firstname:'James'
    }
    const partialBookingPayload = {
        ...createBooking, firstname : 'Jamis'
    }
    
    //update booking 
    const updateBooking = await bookingService.updateBooking(token, newBookingId, updateBookingPayload);
    expect(updateBooking).toHaveProperty('firstname');
    expect(updateBooking.firstname).toBe('James');

    //update partial booking
    const partialUpdateBooking = await bookingService.partialUpdateBooking(token, newBookingId, partialBookingPayload);
    expect(partialUpdateBooking).toHaveProperty('firstname');
    expect(partialUpdateBooking.firstname).toBe('Jamis');

    //delete booking
    await bookingService.deleteBooking(token, newBookingId);

})