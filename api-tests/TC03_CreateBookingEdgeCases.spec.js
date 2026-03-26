const {test, expect} = require('@playwright/test')
const BookingService = require('../api-request/BookingService')
const {createUserPayload, missingKeyPayload,invalidTypePayload,duplicateValuePayload,
outOfRangeValue, emptyValuePayload,nullPayload, emptyPayload} = require('../testData/apiPayload')

test.describe('Booking Service Functionality', ()=>{
    test('Create Booking', async({request})=>{
        const bookingService = new BookingService(request);

        const createUserResponse = await bookingService.createBooking(createUserPayload);
        expect(createUserResponse.status()).toBe(200);

        const createUserBooking = await createUserResponse.json();

        expect(createUserBooking).toHaveProperty('bookingid');
        expect(createUserBooking).toHaveProperty('booking');
        expect(createUserBooking.booking).toHaveProperty('firstname');
        expect(createUserBooking.booking).toHaveProperty('lastname');
        expect(createUserBooking.booking).toHaveProperty('totalprice');
        expect(createUserBooking.booking).toHaveProperty('bookingdates');
        expect(createUserBooking.booking.bookingdates).toHaveProperty('checkin');
        expect(createUserBooking.booking.bookingdates).toHaveProperty('checkout');
        expect(createUserBooking.booking).toHaveProperty('additionalneeds');
    })
    test('Create Booking - Missing Required Field', async({request})=>{
        const bookingService = new BookingService(request);

        const createUserBooking = await bookingService.createBooking(missingKeyPayload);
        expect(createUserBooking.status()).toBe(500);

        const text = await createUserBooking.text(); 
        expect(text).toContain('Internal Server Error');
    })
    test('Create Booking - Invalid data types', async({request})=>{
        const bookingService = new BookingService(request);

        const createUserBooking = await bookingService.createBooking(invalidTypePayload);
        expect(createUserBooking.status()).toBe(400);

        const body = await createUserBooking.json();
        expect(typeof body.booking.totalprice).toBe('number');
        expect(typeof body.booking.depositpaid).toBe('boolean');
    })
    test('Create Booking - Out Of Range values', async({request})=>{
        const bookingService = new BookingService(request);

        const createUserBooking = await bookingService.createBooking(outOfRangeValue);
        expect(createUserBooking.status()).toBe(400);

        const body = await createUserBooking.json();
        expect(body.totalprice).toBeGreaterThan(0);
    })
    test('Create Booking - Empty Values', async({request})=>{
        const bookingService = new BookingService(request);

        const createUserBooking = await bookingService.createBooking(emptyValuePayload);
        expect(createUserBooking.status()).toBe(400);
    })
    test('Create Booking - Duplicate Values', async({request})=>{
        const bookingService = new BookingService(request);

        const createUserBooking = await bookingService.createBooking(duplicateValuePayload);
        expect(createUserBooking.status()).toBe(400);
    })
    test('Create Booking - Null Payload', async({request})=>{
        const bookingService = new BookingService(request);

        const createUserBooking = await bookingService.createBooking(nullPayload);
        expect(createUserBooking.status()).toBe(500);

        const text = await createUserBooking.text(); 
        expect(text).toContain('Internal Server Error');
    })
    test('Create Booking - Empty Payload', async({request})=>{
        const bookingService = new BookingService(request);

        const createUserBooking = await bookingService.createBooking(emptyPayload);
        expect(createUserBooking.status()).toBe(500);

        const text = await createUserBooking.text(); 
        expect(text).toContain('Internal Server Error');
    })
})
