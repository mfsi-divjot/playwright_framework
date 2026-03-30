const createUserPayload = {
    "firstname" : "Jim",
    "lastname" : "Brown",
    "totalprice" : 111,
    "depositpaid" : true,
    "bookingdates" : {
        "checkin" : "2018-01-01",
        "checkout" : "2019-01-01"
    },
    "additionalneeds" : "Breakfast"
}
const missingKeyPayload = {
    "firstname" : "Jim",
    "lastname" : "Brown",
    "bookingdates" : {
        "checkin" : "2018-01-01",
        "checkout" : "2019-01-01"
    },
    "additionalneeds" : "Breakfast"
}
const invalidTypePayload = {
    "firstname" : "Jim",
    "lastname" : "Brown",
    "totalprice" : '111', // make number to string
    "depositpaid" : 'true', // make boolean to string
    "bookingdates" : {
        "checkin" : "2018-01-01",
        "checkout" : "2019-01-01"
    },
    "additionalneeds" : "Breakfast"
}
const outOfRangeValue = {
    "firstname" : "Jim",
    "lastname" : "Brown",
    "totalprice" : -111, // keep the value negative
    "depositpaid" : true,
    "bookingdates" : {
        "checkin" : "2018-01-01",
        "checkout" : "2019-01-01"
    },
    "additionalneeds" : "Breakfast"
}
const emptyValuePayload = {
    "firstname" : "",
    "lastname" : "",
    "totalprice" : 0, 
    "depositpaid" : true,
    "bookingdates" : {
        "checkin" : "",
        "checkout" : ""
    },
    "additionalneeds" : ""
}
const duplicateValuePayload = {
    "firstname" : "Jim",
    "lastname" : "Brown",
    "totalprice" : 111,
    "depositpaid" : true,
    "bookingdates" : {
        "checkin" : "2018-01-01",
        "checkout" : "2019-01-01"
    },
    "additionalneeds" : "Breakfast",
    "firstname" : "John",
    "lastname" : "Van",
    "totalprice" : 222,
    "depositpaid" : false,
    "bookingdates" : {
        "checkin" : "2019-01-01",
        "checkout" : "2020-01-01"
    },
    "additionalneeds" : "Dinner"
}
const emptyPayload = {}
let nullPayload; 

module.exports = {createUserPayload, missingKeyPayload, invalidTypePayload, outOfRangeValue
    ,emptyValuePayload, duplicateValuePayload, nullPayload, emptyPayload
};