const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const {join} = require("path");
const fs = require('fs');
const request = require('request');
const serverCon = require('./ConnectFunction');
const {json} = require("express");

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
let limitMFC = jsonData.mfc_limit;
let limitMFtg = jsonData.mf_tg_limit;
let limitMFtp = jsonData.mf_tp_limit;
if (limitMFC > 1000) {
    limitMFC = 1000
}
if (limitMFtg > 10000) {
    limitMFtg = 10000
}
if (limitMFtp > 10000) {
    limitMFtp = 10000
}
let serverDataSet = {}
// console.log("app", localServerURL, limitMFtg, limitMFtp, limitMFC)

app.get("/dataSelect", function(req, res){

    res.render("dataSelect", {localServerURL: localServerURL, limitMFC: limitMFC});
})
app.get('/', function (req,res) {
    res.render("demo", {title : "hi", localServerURL: localServerURL});
});

app.post("/selectedMFC", function(req, res){
    let receviedMFC = JSON.parse(req.body.mfc_list)

    for (let eachData of receviedMFC){
        serverDataSet[eachData.mfc_id] = eachData
    }
    // console.log(serverDataSet)
    res.json({ok: true});
    // res.render("dataSelect", {localServerURL: localServerURL});
})

app.post("/getSelectedMFC", function(req, res){
    // console.log("getSelectedMFC")
    // console.log(Object.keys(serverDataSet).length)
    if (Object.keys(serverDataSet).length > 0) {
        res.json({ok: true, serverData: serverDataSet});
    }else{
        res.json({ok: false});
    }


    // res.render("dataSelect", {localServerURL: localServerURL});
})
app.post("/datalist", function(req, res){
    // console.log("app/datalist", req.body.address)

    let parameters = {
        limit: req.body.count
    }
    serverCon.GET(req.body.address, parameters, res)

});
app.post("/eachFeature", function(req, res){



    let parameters = {};
    if (req.body.type == undefined){

        let parameters = {
            limit: req.body.limit
        };
        let address = req.body.address+"/"+req.body.title+"/items"
        serverCon.GET(address, parameters, res)
    }
    else{
        if (req.body.type == "-1"){
            // console.log("Get featureValue")
            serverCon.GET(req.body.address, parameters, res)
        }
        else if (req.body.type == "0"){
            // console.log("Get TemporalGeometry", req.body.address)
            // console.log(Array.isArray(req.body.time))
            if (Array.isArray(req.body.time) && req.body.time.length == 2){
                let startTime = req.body.time[0].replace(/\//g, "-");
                let endTime = req.body.time[1].replace(/\//g, "-");
                parameters['datetime'] = startTime + '/' + endTime
            }else{
                parameters['datetime'] = req.body.time
            }
            parameters['subTrajectory'] = true
            parameters['limit']= limitMFtg
            console.log("/eachFeature", req.body.type, req.body.address, parameters)
            // console.log(parameters)
            serverCon.GET(req.body.address, parameters, res)
        }
        else if (req.body.type == "1"){
            // console.log("Get TemporalProperties")
            // console.log(Array.isArray(req.body.time))
            if (Array.isArray(req.body.time) && req.body.time.length == 2){
                let startTime = req.body.time[0].replace(/\//g, "-");
                let endTime = req.body.time[1].replace(/\//g, "-");
                parameters['datetime'] = startTime + '/' + endTime
            }else{
                parameters['datetime'] = req.body.time.replace(/\//g, "-")
            }

            parameters['limit']= limitMFtp
            parameters['subTemporalValue'] = true
            console.log("/eachFeature", req.body.type, req.body.address, parameters)
            serverCon.GET(req.body.address, parameters, res)
        }
    }
});


app.listen(8080, function(){
    console.log('Stinuum Web running publicly. Connect to http://localhost:8080/');
});