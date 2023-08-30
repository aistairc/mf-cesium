const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const {join} = require("path");
const fs = require('fs');
const request = require('request');
const serverCon = require('./ConnectFunction');

app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static(__dirname +'/'));
app.use(express.static(join(__dirname, "node_modules")));
app.use(express.static(join(__dirname, "src")));


const jsonFile = fs.readFileSync('./system.json', 'utf8');
const jsonData = JSON.parse(jsonFile);
const localServerURL = jsonData.mf_api_server_url;
console.log("app", localServerURL)

app.get("/dataSelect", function(req, res){

    res.render("dataSelect", {localServerURL: localServerURL});
})
app.get('/', function (req,res) {
    res.render("demo", {title : "hi", localServerURL: localServerURL});
});

app.post("/datalist", function(req, res){
    console.log("app/datalist", req.body.address)

    let parameters = {
        limit: req.body.count
    }
    serverCon.GET(req.body.address, parameters, res)

});
app.post("/eachFeature", function(req, res){

    // let parameters = {limit : 10};
    let parameters = {};
    if (req.body.type == undefined){
        console.log("here undefined")
        let parameters = {
            limit: req.body.limit
        };
        let address = req.body.address+"/"+req.body.title+"/items"
        serverCon.GET(address, parameters, res)
    }
    else{
        if (req.body.type == "-1"){
            console.log("Get featureValue")
            serverCon.GET(req.body.address, parameters, res)
        }
        else if (req.body.type == "0"){
            console.log("Get TemporalGeometry", req.body.address)
            console.log(Array.isArray(req.body.time))
            if (Array.isArray(req.body.time) && req.body.time.length == 2){
                parameters['time'] = req.body.time[0] + ',' + req.body.time[1]
            }else{
                parameters['time'] = req.body.time
            }

            parameters['limit']= req.body.limit

            serverCon.GET(req.body.address, parameters, res)
        }
        else if (req.body.type == "1"){
            console.log("Get TemporalProperties")
            console.log(Array.isArray(req.body.time))
            if (Array.isArray(req.body.time) && req.body.time.length == 2){
                parameters['time'] = req.body.time[0] + ',' + req.body.time[1]
            }else{
                parameters['time'] = req.body.time
            }

            parameters['limit']= req.body.limit

            serverCon.GET(req.body.address, parameters, res)
        }
    }
});


app.listen(8080, function(){
    console.log('Stinuum Web running publicly. Connect to http://localhost:8080/');
});