const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const {join} = require("path");

const request = require('request');
const serverCon = require('./ConnectFunction');

app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static(__dirname +'/'));
app.use(express.static(join(__dirname, "node_modules")));
app.use(express.static(join(__dirname, "src")));

// app.get("/", function(req, res){
//
//     res.render("login", {});
// })
app.get("/dataSelect", function(req, res){

    res.render("dataSelect", {});
})
// app.get('/main', function (req,res) {
//     res.render("demo", {title : "hi"});
// });

app.get('/', function (req,res) {
    res.render("demo", {title : "hi"});
});

// app.post("/login", function(req, res){
//     if(req.body.check==0){
//         let parameters = {
//             id: req.body.token
//         }
//         serverCon.GET(req.body.address, parameters, res)
//     }else{
//         serverCon.ServerLogin(req.body.address, req.body.name ,req.body.password, res)
//     }
// });

app.post("/datalist", function(req, res){
    console.log("app/datalist", req.body.address)
    // let parameters = {
    //     limit: req.body.count,
    //     token: req.body.token,
    //     session_id: req.body.session_id
    // }
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
            // let parameters = {
            //     time: req.body.time[0] + ',' + req.body.time[1],
            //     limit: req.body.limit,
            //     token: req.body.token,
            //     session_id: req.body.session_id
            // }
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
            // let parameters = {
            //     name: req.body.name,
            //     time: req.body.time[0] + ',' + req.body.time[1],
            //     limit: req.body.limit,
            //     token: req.body.token,
            //     session_id: req.body.session_id
            // }
            serverCon.GET(req.body.address, parameters, res)
        }
    }
});
// app.post("/main2", function(req, res){
//     console.log(req.body.data)
//     var dataObj = JSON.parse(req.body.data);
//     if (dataObj.type == 1){
//         let parameters = {
//             time: dataObj.time[0] + ',' + dataObj.time[1],
//             limit: dataObj.limit
//         }
//         serverCon.GET(dataObj.address, parameters, res)
//     }
// });

app.listen(8080, function(){
    console.log('Stinuum Web running publicly. Connect to http://localhost:8080/');
});