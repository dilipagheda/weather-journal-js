// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const PORT = 3000;

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));


// Setup Server
app.listen(PORT, () => console.log(`Weather Journal Server is listening at http://localhost:${PORT}`));

// GET route
app.get("/api/entry", function (request, response) {
    response.json(projectData);
});

//POST route
app.post('/api/entry', function (request, response) {
    const userData = request.body;
    if (userData && userData.temperature && userData.date && userData.feeling) {
        projectData.temperature = userData.temperature;
        const date = new Date(userData.date * 1000);
        const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' })
        const [{ value: month }, , { value: day }, , { value: year }] = dateTimeFormat.formatToParts(date)
        projectData.date = `${day} ${month} ${year}`;
        projectData.feeling = userData.feeling;
        projectData.city = userData.city;
        projectData.country = userData.country;

        response.status(201).end();
    }
    else {
        response.status(400).json({ error: "bad data" });
    }
});