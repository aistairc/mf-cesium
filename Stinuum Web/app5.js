const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
const {PythonShell} = require('python-shell');
const path = require('path');
const request = require('request');
const fs = require('fs')
app.use(express.json({ limit : "50mb" })); 
app.use(express.urlencoded({ limit:"50mb", extended: false }));
app.use(bodyParser.json({limit: '50mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static(__dirname +'/'));
app.use('/js', express.static(__dirname + '/js'));



app.get("/", function(req, res){

    res.render("demo5", {});
})
app.get("/dataSelect", function(req, res){

    res.render("dataSelect", {});
})

app.post("/saveJSON", function(req, res){
    console.log(req.body)
    let fileName = req.body.name
    let dPath = "/home/dprt/Documents/dprt/oldVersionCesium/githubMFCesium/mf-cesium/Stinuum Web/data/testData/"
    let data = req.body
    
    fs.writeFileSync(dPath+fileName+"2-simplify-5m.json", JSON.stringify(data))
    
})

app.listen(8080, function(){
    console.log('Stinuum Web running publicly. Connect to http://localhost:8080/');
});