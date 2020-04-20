import { geonamesApi, weatherbitApi, pixabayApi } from './apiLinks';
import { errorHandler, errorMessages, presentDate, gapDays, localNodeEnv } from './handler';



const retrieveGeonamesApi = async (cityName) => {
    const geoLink = geonamesApi(cityName);
    const res = await fetch(geoLink);
    try {
        const data = await res.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log('retrieveGeonamesApi error: ', error);
        errorHandler(`There was and error: ${error}`);
    }
};


const retrieveWeatherbitApi = async (days, lat, lot) => {
    const weatherLink = weatherbitApi(days, lat, lot);
    const res = await fetch(weatherLink);
    try {
        const data = await res.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log('retrieveWeatherbitApi error: ', error);
        errorHandler(`There was and error: ${error}`);
    }
};


const retrievePixabayApi = async (location) => {
    const pixabayLink = pixabayApi(location);
    const res = await fetch(pixabayLink);
    try {
        const data = await res.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log('retrievePixabayApi error: ', error);
        errorHandler(`There was and error: ${error}`);
    }
};


const postDatas = async (url = '', data = {}) => {
    const response = await fetch(localNodeEnv() + url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    try {
        const neweatherData = await response.json();
        console.log(neweatherData);
        return neweatherData;
    } catch (error) {
        console.log('postData error: ', error);
        errorHandler('There was and error. Please, try it again.');
    }
};



const handleSubmit = event => {
    event.preventDefault();
    errorMessages();
    const cityName = document.getElementById('cityName').value;
    const travelDate = document.getElementById('travelDate').value;

    let countDays = Math.round(gapDays(new Date(), new Date(travelDate))) + 1;
    if (countDays == 0) countDays++;
    console.log(countDays);

    if (!cityName) {
        errorHandler('Fill the city name you want to travel to.');
        return;
    }
    if (!travelDate) {
        errorHandler('Fill the date trip.');
        return;
    }
    retrieveGeonamesApi(cityName)
        .then(function (geoData) {
            if (geoData && geoData.totalResultsCount && geoData.totalResultsCount > 0 && geoData.geonames[0]) {
                retrieveWeatherbitApi(countDays, geoData.geonames[0].lat, geoData.geonames[0].lng)
                    .then(function (weatherData) {
                        if (weatherData && weatherData.data) {
                            retrievePixabayApi(geoData.geonames[0].name + '+' + geoData.geonames[0].countryName)
                                .then(function (pixaData) {
                                    let postData = {
                                        latitude: weatherData.lat,
                                        longitude: weatherData.lon,
                                        cityName: geoData.geonames[0].name,
                                        country: geoData.geonames[0].countryName,
                                        max_temp: weatherData.data[weatherData.data.length - 1].max_temp,
                                        min_temp: weatherData.data[weatherData.data.length - 1].min_temp,
                                        weatherDesc: weatherData.data[weatherData.data.length - 1].weather.description,
                                        weatherCloud: weatherData.data[weatherData.data.length - 1].weather.icon,
                                        travelDate: weatherData.data[weatherData.data.length - 1].valid_date,
                                        imageLink: pixaData.hits[0] ? pixaData.hits[0].webformatURL : null
                                    };
                                    localStorage.setItem('travelData', JSON.stringify(postData));
                                    postDatas('/addData', postData);
                                })
                                .then(updateUI);
                        }
                    })
            }
            else errorHandler('Sorry, not found your city. Please enter different one');
        })
};


const updateUI = async () => {
    const request = await fetch(localNodeEnv() + '/travelData');
    try {
        const getData = await request.json();
        console.log(getData);
        upUi(getData)
    } catch (error) {
        console.log('update UI error: ', error);
        errorHandler('There was and error. Please, try it again.');
    }
};

const upUi = (getData) => {
    document.getElementById('container').classList.remove('hidden');
    if (getData.imageLink) {
        document.getElementById('destination-img').setAttribute('src', getData.imageLink);
        document.getElementById('destination-img').classList.remove('hidden');
    } else {
        document.getElementById('destination-img').classList.add('hidden');
    }
    document.getElementById('location-header').innerHTML = `Destination: ${getData.cityName}, ${getData.country}`;
    document.getElementById('departure-date').innerHTML = `Departure date: ${getData.travelDate}`;
    document.getElementById('highTemp').innerHTML = `High: ${getData.max_temp}&#8451;`;
    document.getElementById('lowTemp').innerHTML = `Low: ${getData.min_temp}&#8451;`;
    document.getElementById('weatherCloud').setAttribute('src', `https://www.weatherbit.io/static/img/icons/${getData.weatherCloud}.png`);
    document.getElementById('weather-forecast').innerHTML = `${getData.weatherDesc}`;
};


const initializeForm = () => {
    document.getElementById('submit').addEventListener('click', handleSubmit);

    let inputDate = document.getElementById('travelDate');
    inputDate.value = presentDate();
    inputDate.setAttribute('min', presentDate());
    inputDate.setAttribute('max', presentDate(16));

    let travelData = localStorage.getItem('travelData');
    if (travelData) {
        upUi(JSON.parse(travelData));
    }
};

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

export { handleSubmit, initializeForm, retrieveGeonamesApi, retrievePixabayApi }