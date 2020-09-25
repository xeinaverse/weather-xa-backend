const request = require('request')
const url = `http://api.openweathermap.org/data/2.5/weather?q=Cairo&units=metric&appid=9a2af47abd7e3b5d678d36a146ea5a05`;


request(url, (error, response, body) => {
  const data = JSON.parse(body)
  console.log(`It's currently ${data.main.temp} outside.`);
}
)