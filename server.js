//adding all modules
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const server = require("https");
const app = express();

//setting up everything we require
require("dotenv").config();

app.set("view engine", "ejs");
app.set("views", "views");
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.static(path.join(__dirname, "public")));

let appid = process.env.APPID;
let host = process.env.HOST;


//setting and working with our routes

app.get("/", (req, res) => {
    res.render("index", { data: null, error: "Enter a city name to get weather data" });
})

app.post("/", (req, res) => {
    //getting users input
    let cityNames = req.body.citynames;

    //getting open weather endpoint
    const weatherData = `https://api.openweathermap.org/data/2.5/weather?q=${cityNames}&appid=${appid}&units=metric`;

    //requesting data from openWeather Servers
    server.get(weatherData, response => {

        response.on("data", data => {
            //use try and catch to catch all possible errors
            try {
                const allWeatherData = JSON.parse(data);
                const imageIcon = allWeatherData.weather[0].icon;
                const image = `http://openweathermap.org/img/wn/${imageIcon}@2x.png`;

                res.render("index", {
                    data: allWeatherData,
                    img: image,
                    error: null
                });

            }
            catch (e) {
                res.render("index", { data: null, error: "Enter a city name to get weather data" });
            }

        })
    })

})

app.listen(host, () => {
    console.log(`Server running at port ${host}`);
})