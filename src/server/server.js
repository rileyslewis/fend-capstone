const dotenv = require('dotenv');
dotenv.config();

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const path = require('path');
const app = express();

/* Middleware*/
app.use(cors());

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('dist'));
//Creating Routes
app.get('/', function (req, res) {
    
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
    
})

let projectData = {};


//handle the recieved data from geo names API
app.post('/addData', addData);
//GET request returns the project data
app.get('/travelData', travelData);

//get project data from server
function travelData(req, res) {
    console.log(projectData);
    res.send(JSON.stringify(projectData));
}

//store project data to server
function addData(req, res) {
    projectData = {};
    projectData = req.body;
    console.log(projectData);
}

app.listen(3000, function () {
    console.log('Travel App available on port 3000.');
});

module.exports = app;