const {test, expect} = require('@playwright/test')
const {user} = require('../testData/apiUserData')
const AuthService = require('../api-request/AuthService')
const BookingService = require('../api-request/BookingService')
const {createUserPayload} = require('../testData/apiPayload')

let token;

// Get auth token before all tests
test.beforeAll(async ({ request }) => {
    const authService = new AuthService(request);
    const getToken = await authService.createToken(user.username, user.password);
    token = getToken.token;
    expect(getToken).toHaveProperty('token');

});
test.describe('Booking Service', ()=>{
    test('Get Booking Ids', async({request})=>{
        const bookingService = new BookingService(request);

        const getBookingIds = await bookingService.getBookingId(token);
        expect(getBookingIds.length).toBeGreaterThan(0);
        expect(getBookingIds[0]).toHaveProperty('bookingid');
    })
    test('Get Booking Details', async({request})=>{
        const bookingService = new BookingService(request);

        const getBookingIds = await bookingService.getBookingId(token);
        const getId = await getBookingIds[0].bookingid;
        const getBookings = await bookingService.getBooking(getId);

        expect(getBookings).toHaveProperty('firstname');
        expect(getBookings).toHaveProperty('lastname');
        expect(getBookings).toHaveProperty('totalprice');
        expect(getBookings).toHaveProperty('depositpaid');
        expect(getBookings).toHaveProperty('bookingdates');
        expect(getBookings.bookingdates).toHaveProperty('checkin');
        expect(getBookings.bookingdates).toHaveProperty('checkout');
        expect(getBookings).toHaveProperty('additionalneeds');
    })
    test('Create Booking', async({request})=>{
        const bookingService = new BookingService(request);

        const createUserResponse = await bookingService.createBooking(createUserPayload);
        const createUserBooking = await createUserResponse.json();
        expect(createUserBooking).toHaveProperty('bookingid');
        expect(createUserBooking).toHaveProperty('booking');
        expect(createUserBooking.booking).toHaveProperty('firstname');
        expect(createUserBooking.booking).toHaveProperty('lastname');
        expect(createUserBooking.booking).toHaveProperty('totalprice');
        expect(createUserBooking.booking).toHaveProperty('depositpaid');
        expect(createUserBooking.booking).toHaveProperty('bookingdates');
        expect(createUserBooking.booking.bookingdates).toHaveProperty('checkin');
        expect(createUserBooking.booking.bookingdates).toHaveProperty('checkout');
        expect(createUserBooking.booking).toHaveProperty('additionalneeds');
    })
    test('Get Request after creating user', async({request})=>{
        const bookingService = new BookingService(request);

        const createUserResponse = await bookingService.createBooking(createUserPayload);
        const createUserBooking = await createUserResponse.json();

        const getNewId = await createUserBooking.bookingid;

        const getBookings = await bookingService.getBooking(getNewId);
        expect(getBookings).toHaveProperty('firstname');
        expect(getBookings).toHaveProperty('lastname');
        expect(getBookings).toHaveProperty('totalprice');
        expect(getBookings).toHaveProperty('depositpaid');
        expect(getBookings).toHaveProperty('bookingdates');
        expect(getBookings.bookingdates).toHaveProperty('checkin');
        expect(getBookings.bookingdates).toHaveProperty('checkout');
        expect(getBookings).toHaveProperty('additionalneeds');
    })
    test('Update Booking', async({request})=>{
        const bookingService = new BookingService(request);

        const createUserResponse = await bookingService.createBooking(createUserPayload);
        const createUserBooking = await createUserResponse.json();
        const getNewId = await createUserBooking.bookingid;

        const updateUserBooking = await bookingService.updateBooking(token, getNewId);
        expect(updateUserBooking).toHaveProperty('firstname');
        expect(updateUserBooking.firstname).toBe('James');

        const getBookings = await bookingService.getBooking(getNewId);
        expect(getBookings.firstname).toBe('James');
    })
    test('Update Partial Booking', async({request})=>{
        const bookingService = new BookingService(request);

        const createUserResponse = await bookingService.createBooking(createUserPayload);
        const createUserBooking = await createUserResponse.json();
        const getNewId = await createUserBooking.bookingid;

        const updateUserBooking = await bookingService.partialUpdateBooking(token, getNewId);
        expect(updateUserBooking).toHaveProperty('firstname');
        expect(updateUserBooking.firstname).toBe('Jamis');

        const getBookings = await bookingService.getBooking(getNewId);
        expect(getBookings.firstname).toBe('Jamis');
    })
    test('Delete Booking', async({request})=>{
        const bookingService = new BookingService(request);

        const createUserResponse = await bookingService.createBooking(createUserPayload);
        const createUserBooking = await createUserResponse.json();
        const getNewId = await createUserBooking.bookingid;

        const deleteUserBooking = await bookingService.deleteBooking(token, getNewId);
    })
})