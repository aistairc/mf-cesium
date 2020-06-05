const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
const {PythonShell} = require('python-shell');
const path = require('path');
const request = require('request');


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static(__dirname +'/'));
app.use('/js', express.static(__dirname + '/js'));


app.get('/', function (req,res) {
    res.render("demo", {});
});

app.listen(8080, function(){
    console.log('Stinuum Web running publicly. Connect to http://localhost:8080/');
});