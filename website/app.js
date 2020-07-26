/* Global Variables */

// Personal API Key for OpenWeatherMap API
const API_KEY = '<INSERT_YOUR_API_KEY_HERE>';

//URLs
const BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast?';
const POST_ENTRY_ENDPOINT = 'http://localhost:3000/api/entry';
const GET_ENTRY_ENDPOINT = 'http://localhost:3000/api/entry';

/* Function to GET Web API Data*/
function getWeatherData(zipCode, countryCode = 'US') {
    //construct the full url
    const url = `${BASE_URL}zip=${zipCode},${countryCode}&units=metric&appid=${API_KEY}`;

    //make a fetch call
    return fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data)
            if (data.cod !== "200") {
                updateUIWithAPIError(data.message);
                return;
            }
            return data;
        })
}

// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', clickHandler);

/* Function called by event listener */
function clickHandler() {
    //reset UI
    resetUI();
    //get the country code
    const countryCode = document.getElementById('country').value;
    //get the zip code value
    const zip = document.getElementById('zip').value;
    //get the value for feelings
    const feeling = document.getElementById('feelings').value;
    //validation
    if (!countryCode || !zip || !feeling) {
        alert("please check the input data");
        return;
    }

    getWeatherData(zip, countryCode)
        .then(weatherData => postWeatherEntry(POST_ENTRY_ENDPOINT, weatherData, feeling))
        .catch(error => {
            console.log(error);
            updateUIWithAPIError();
        });
}

/* Function to POST data */
async function postWeatherEntry(url = '', weatherData, userReponse) {
    if (weatherData && weatherData.list && weatherData.list.length > 0) {
        const todaysWeather = weatherData.list[0];
        console.log(todaysWeather);
        const payload = {
            date: todaysWeather.dt,
            temperature: todaysWeather.main.temp,
            feeling: userReponse,
            city: weatherData.city.name,
            country: weatherData.city.country
        };

        try {
            await fetch(url, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                referrerPolicy: 'no-referrer',
                body: JSON.stringify(payload)
            });

            await getWeatherEntry(GET_ENTRY_ENDPOINT)
        }
        catch (error) {
            console.log(error);
            updateUIWithAPIError();
        }
    }
}

/* Function to GET Project Data */
async function getWeatherEntry(url = '') {
    const data = await fetch(url)
        .then(response => response.json());

    updateUI(data);
}

/* Function to update UI with most recent entry of weather journal */
function updateUI(mostRecentEntry) {
    let holderDiv = document.querySelector('.holder');
    let entryDiv = document.createElement('div');
    entryDiv.className = 'entry';

    let titleDiv = document.createElement('div');
    titleDiv.className = 'title';
    titleDiv.innerHTML = `Most Recent Entry for ${mostRecentEntry.city}, ${mostRecentEntry.country}`;

    let entryHolder = document.createElement('div');
    entryHolder.setAttribute('id', 'entryholder');

    let dateDiv = document.createElement('div');
    dateDiv.setAttribute('id', 'date');
    let tempDiv = document.createElement('div');
    tempDiv.setAttribute('id', 'temp');

    entryHolder.appendChild(dateDiv);
    entryHolder.appendChild(tempDiv);

    let contentDiv = document.createElement('div');
    contentDiv.setAttribute('id', 'content');

    entryDiv.appendChild(titleDiv);
    entryDiv.appendChild(entryHolder);
    entryDiv.appendChild(contentDiv);
    holderDiv.appendChild(entryDiv);

    document.getElementById('date').innerHTML = mostRecentEntry.date;
    document.getElementById('temp').innerHTML = `${mostRecentEntry.temperature}<span>&#8451;</span>`;
    document.getElementById('content').innerHTML = mostRecentEntry.feeling;
}

/* Function to reset UI */
function resetUI() {
    const entryDiv = document.querySelector('.entry');
    if (entryDiv) {
        entryDiv.remove();
    }
}

/* Function to update UI with an error message */
function updateUIWithAPIError(message) {
    let holderDiv = document.querySelector('.holder');
    let entryDiv = document.createElement('div');
    entryDiv.className = 'entry';

    let titleDiv = document.createElement('div');
    titleDiv.className = 'title';
    titleDiv.innerHTML = message ? message : 'Sorry something went wrong!';

    entryDiv.appendChild(titleDiv);
    holderDiv.appendChild(entryDiv);
}

resetUI();

