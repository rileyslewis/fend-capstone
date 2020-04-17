import { geonamesApi, weatherbitApi, pixabayApi, updateUI } from '../src/client/js/app.js';

test('Geonames api works as a function', () => {
    expect(typeof geonamesApi).toBe('function');
});

test('Weatherbit Api function works', () => {
    expect(typeof weatherbitApi).toBe('function');
});

test('Pixabay api function works', () => {
    expect(typeof pixabayApi).toBe('function');
});

test('Update UI function works', () => {
    expect(typeof updateUI).toBe('function');
});