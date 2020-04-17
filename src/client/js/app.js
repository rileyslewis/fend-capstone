/*Global Variables*/
export let travel = {};
// Geoname Api
const baseURL = 'http://api.geonames.org/postalCodeSearchJSON?placename=';
const username = '&maxRows=10&username=omerlewis';

// Weatherbit Api
const weatherbitKey = '90c575084da043c5a1e5c863674ce839';
const weatherUrl = 'http://api.weatherbit.io/v2.0/current?lat=';
const forecastUrl = 'https://api.weatherbit.io/v2.0/forecast/daily?lat=';

// Pixabay Api
const pixabayKey = '16027123-89b2124b20fb53685b168390b';
const pixabayUrl = 'https://pixabay.com/api/?key=';
const pixabayImageUrl = '&image_type=photo&pretty=true&category=places';

const date = document.querySelector('#departure-dates')

// Geonames Api
export const geonamesApi = async (location) => {
    
    const findCoordinates = await fetch(baseURL + location + username)
    .then((response) => {
        return response.json();
    }).then( (data) => {
        const coordinates = {
            lat: data.postalCodes[0].lat,
            lng: data.postalCodes[0].lng,
            countryCode: data.postalCodes[0].countryCode,
            city: data.postalCodes[0].placeName,
            country: data.postalCodes[0].countryName
        }
          travel.coords = coordinates;
    }).catch ((error) => {
        console.log(error);
    });
}


// Weatherbit Api
export const weatherbitApi =  async (date) => {
    const travelDates = new Date(date).getTime();
    const present = new Date().getTime();
    const dayMargins = (travelDates - present) / (1000 * 3600 * 24);
    
    const latitude = travel.coords.lat;
    const longitude = travel.coords.lng;

    let url = (dayMargins > 7) ? weatherUrl + latitude + '&lon=' + longitude + '&key=' + weatherbitKey : forecastUrl + latitude + '&lon=' + longitude + '&key=' + weatherbitKey;
    const postData = await fetch('http://localhost:3000/weather', {
        method: 'POST',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({url: url})
    });

    const response = postData.json();
    response.then( (data) => {
        travel.weatherData = data; 
        travel.dates = dayMargins; 
    }).catch( (error) => {
        console.log(error);
    });
    console.log(travel.dates);
}


// Pixabay Api
export const pixabayApi = async(city) => {
    city = city.replace(/\s/g, '+');
    const country = travel.coords.country;
    const cityLink =  pixabayUrl + pixabayKey + '&q=' + city + pixabayImageUrl;
    const countryLink = pixabayUrl + pixabayKey + '&q=' + city + ',' + country + pixabayImageUrl;
    const getPixabayApi = await fetch(cityLink);
    let data = await getPixabayApi.json();
        if (data.totalHits > 0) {
            const photo = {
              src: data.hits[0].largeImageURL
            }
        travel.photo = photo; 
        } else {
            const getPixabayApi =  await fetch(countryLink);
        
            let data = await getPixabayApi.json();
            const photo = {
              src: data.hits[0].webformatURL
            }
            travel.photo = photo; 
        }
}
        

/*Update UI */
export function updateUI (travel) {
    const dayCount = travel.dates;
    const days = (dayCount === 1) ? 'day' : 'days';
    const photoUrl = travel.photo.src;
    const highTemp = Math.round(travel.weatherData.dayHighTemp);
    const lowTemp = Math.round(travel.weatherData.dayLowTemp);
    const temp = Math.round(travel.weatherData.tempAtm);

    document.querySelector('.data-container').style.display = 'flex';
    if (travel.coords.country == undefined) {
        
        document.querySelector('.country').innerHTML = travel.coords.city;

    }else {
        document.querySelector('.country').innerHTML = travel.coords.city + ', ' + travel.coords.country;
    }
    // duration of trip
    const returnDate = document.querySelector('#return-date').value;
    const departureDate = document.querySelector('#departure-date').value;
    const lengthRet = ((dateOne, dateTwo) => {
    const dDay = new Date(dateOne);
    const rDay = new Date(dateTwo);
    return Math.floor((Date.UTC(rDay.getFullYear(), rDay.getMonth(), rDay.getDate()) - Date.UTC(dDay.getFullYear(), dDay.getMonth(), dDay.getDate()) ) /(1000 * 60 * 60 * 24));
    })(departureDate, returnDate);

    document.querySelector('.duration').innerHTML = lengthRet;
    if(lengthRet > 1) {
        document.querySelector('.duration-days').innerHTML = ' days';
    } else {
        document.querySelector('.duration-days').innerHTML = 'day';
    }
    document.querySelector('.days').innerHTML = `${dayCount} ${days} `;
    document.querySelector('.img').src = photoUrl;
    if (dayCount > 7) {
        document.querySelector('.temp').innerHTML = `Temperature: ${temp}&#8451;`;
    } else {
        document.querySelector('.temp').innerHTML = `High: ${highTemp}&#8451;, Low: ${lowTemp}&#8451;`;
    }
}


export const handleSubmit = async (city) => {

    geonamesApi(city)
    .then(() => weatherbitApi(date))
    .then(() => pixabayApi(city))
    .then(() => updateUI(travel));

}

