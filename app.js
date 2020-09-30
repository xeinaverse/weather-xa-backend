const port = process.env.PORT || 4000
const request = require('request')
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://skull:candy11@cluster0.mli7b.azure.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
let latitude, longitude;
let url;
let temperature, city, status;
let today = new Date();
  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.listen(port, (error) => {
  if (error)
    console.log('Something went wrong', error)
  else
    console.log(`Listening on port ${port}.`)
})

app.get('/', (req, res) => {
  res.send('welcome')
})

app.post('/locationInfo', (req, res) => {
  latitude = req.body.data.latitude;
  longitude = req.body.data.longitude;
  url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=9a2af47abd7e3b5d678d36a146ea5a05`;
  request(url, (error, response, body) => {
    data = JSON.parse(body)
    temperature = data.main.temp;
    city = data.name;
    status = data.weather[0].description;
    res.send(JSON.stringify({ temperature, city, status }))
  })
  
  client.connect(err => {
    const collection = client.db("Weather").collection("data").insertOne( { CityName: city, Temperature: temperature, Date: today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear(), Time: today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()}, function(err, res) {
      if (err) throw err;
    });
    client.close();
  });
});
