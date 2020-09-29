const port = process.env.PORT || 4000
const request = require('request')
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const { timeStamp } = require('console');

let lati, long;
let url;
let temperature, city, status;

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
  lati = req.body.data.lati;
  long = req.body.data.long;
  url = `http://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${long}&units=metric&appid=9a2af47abd7e3b5d678d36a146ea5a05`;
  request(url, (error, response, body) => {
    data = JSON.parse(body)
    temperature = data.main.temp;
    city = data.name;
    console.log(data)
    status = data.weather[0].description;
    console.log(`It's currently ${data.main.temp} in ${data.name}.`)
    res.send(JSON.stringify({ temperature, city, status }))
  })
  let today = new Date();
  const MongoClient = require('mongodb').MongoClient;
  const uri = "mongodb+srv://skull:candy11@cluster0.mli7b.azure.mongodb.net/<dbname>?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("Weather").collection("data").insertOne( { CityName: city, Temperature: temperature, Date: today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(), Time: today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()}, function(err, res) {
      if (err) throw err;
    });
    client.close();
  });
});

