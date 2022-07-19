const express = require("express");
const app = express();
const mongoose = require("mongoose");
var bodyParser = require("body-parser");

const path = require('path')

app.get("/", (req, res) => {
    res.send("jay swaminarayan Jay kashtbhanjan dev");
});

app.set("views", "C:/krupal-learning/Task/Imaginarium/views");
app.set("view engine", "ejs");

//Use middleware
app.use(express.static(path.join(__dirname, 'public/')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const user = require('./Route/M_route');
app.use("/",user);
const Book = require('./Route/B_route');
app.use('/book/',Book);
const Series = require('./Route/S_route');
app.use('/series',Series);

mongoose.connect("mongodb://localhost:27017/DDS-Movie",{ useNewUrlParser: true },(error) => {
  if (!error) {
    console.log("Connect to Database");    
  } else {
      console.log(error.message);
    }
  }
);

//define Port
app.listen(8888, () => {
  console.log("Connect to Server");
});
