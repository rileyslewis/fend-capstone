import { geonamesApi, weatherbitApi, pixabayApi, updateUI } from '../src/client/js/apiLinks.js';
import { retrieveGeonamesApi, retrievePixabayApi } from '../src/client/js/app.js';
import { presentDate, gapDays, localNodeEnv } from '../src/client/js/handler.js';

const fetch = require("node-fetch");

// Links
describe('geonames api', () => {
    test('url', () => {
        expect(geonamesApi('Tokyo')).toEqual('http://api.geonames.org/searchJSON?username=omerlewis&fuzzy=0.8&maxRows=10&name=Tokyo');
    });
});

describe('WeatherBit', () => {
    test('url', () => {
        expect(weatherbitApi(6, '35.69', '139.69')).toEqual('http://api.weatherbit.io/v2.0/forecast/daily?units=M&key=90c575084da043c5a1e5c863674ce839&days=6&lat=35.69&lon=139.69');
    });
});

describe('Pixabay', () => {
    test('url', () => {
        expect(pixabayApi('Tokyo+Japan')).toEqual('https://pixabay.com/api/?key=16027123-89b2124b20fb53685b168390b&per_page=3&image_type=photo&q=Tokyo+Japan');
    });
});


// app
describe('retrieveGeonamesApi', () => {
    test('data', () => {
        expect(retrieveGeonamesApi('Tokyo')).toBeDefined();
    });
});

describe('retrievePixabayApi', () => {
    test('data', () => {
        expect(retrievePixabayApi('Tokyo+Japan')).toBeDefined();
    });
});


// handlers / errors


describe('presentDate', () => {
    test('add 0', () => {
        Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
        };

        expect(presentDate()).toEqual('2020-05-05');
    });
    test('add 6', () => {
        
        //add a method addDays for Date prototype
        Date.prototype.addDays = function(days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        };

        expect(presentDate(6)).toEqual('2020-05-11');
    });
});

describe('gapDays', () => {
    test('gapDays', () => {
        expect(gapDays(new Date('2020-05-05'), new Date('2020-05-06'))).toEqual(1);
    });
    test('countDays 4', () => {
        expect(gapDays(new Date('2020-05-05'), new Date('2020-05-09'))).toEqual(4);
    });
});

describe('localNodeEnv', () => {
    test('url', () => {
        expect(localNodeEnv()).toEqual('');
    });
});