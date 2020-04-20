const geonamesApi = location => {
    const baseUrl = 'http://api.geonames.org/searchJSON';
    const username = '?username=omerlewis&fuzzy=0.8&maxRows=10&name=';
    return baseUrl + username + location;
};

const weatherbitApi = (day, lat, lon) => {
    const weatherbitUrl = 'http://api.weatherbit.io/v2.0/forecast/daily';
    const weatherbitKey = '?units=M&key=90c575084da043c5a1e5c863674ce839';
    const daySect = '&days=';
    const latSect = '&lat=';
    const lonSect = '&lon=';
    return weatherbitUrl + weatherbitKey + daySect + day + latSect + lat + lonSect + lon;
};

const pixabayApi = query => {
    const pixabayURL = 'https://pixabay.com/api/';
    const pixabayKey = '?key=16027123-89b2124b20fb53685b168390b&per_page=3&image_type=photo&q='
    return pixabayURL + pixabayKey + query;
};

export { geonamesApi, weatherbitApi, pixabayApi}