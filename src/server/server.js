const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const fetch = require('node-fetch');
/* Dependencies */
const bodyParser = require('body-parser')

/* Middleware*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());

app.use(express.static('dist'));

const port = 3000;
/* Spin up the server*/
const server = app.listen(port, listening);
 function listening(){
    console.log(`Running Travel App on localhost: ${port}`);
  };

let travel = {};
// GET Route
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

console.log(__dirname)

app.post('/weather', async (req, res) => {
  const getWeather = await fetch(req.body.url);
  const response = getWeather.json();
  response.then((weather) => {
    const weatherbit = {
      tempAtm: weather.data[0].temp,
      dayHighTemp: weather.data[0].highTemp,
      dayLowTemp: weather.data[0].lowTemp
    }
  res.send(weatherbit);

  }).catch ((error) => {
    console.log(error);
  })

})

app.get('/data', (req, res) => {
  res.send(travel);
  console.log(travel);
})

module.exports = app
