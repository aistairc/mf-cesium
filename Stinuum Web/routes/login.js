// var express = require('express');
// var router = express.Router();
// var serverCon = require('../ConnectFunction');
//
//
// router.get('/', function(req, res, next) {
//     res.render('login', { title: 'Express' });
// });
// router.post("/login", function(req, res){
//     console.log(req)
//     if(req.body.check==0){
//         let parameters = {
//             id: req.body.token
//         }
//         serverCon.GET(req.body.address, parameters, res)
//     }else{
//         serverCon.ServerLogin(req.body.address, req.body.name ,req.body.password, res)
//     }
// });
// router.get('/main', function(req, res, next) {
//     res.render('demo', {});
// });
// router.get('/dataSelect', function(req, res, next) {
//     res.render('dataSelect', { title: 'Express' });
// });
// router.post("/datalist", function(req, res){
//     let parameters = {
//         limit: req.body.count,
//         token: req.body.token,
//         session_id: req.body.session_id
//     }
//     serverCon.GET(req.body.address, parameters, res)
// });
// router.post("/eachFeature", function(req, res){
//     console.log("eachFeature")
//     console.log(req.body)
//     let parameters = {
//         token: req.body.token,
//         session_id: req.body.session_id
//     }
//     if (req.body.type == undefined){
//         var address = req.body.address+"/"+req.body.title+"//featureKeys"
//         serverCon.GET(address, parameters, res)
//     }
//     else{
//         if (req.body.type == "-1"){
//             console.log("Get featureValue")
//             serverCon.GET(req.body.address, parameters, res)
//         }
//         else if (req.body.type == "0"){
//             console.log("Get TemporalGeometry")
//             console.log(Array.isArray(req.body.time))
//             if (Array.isArray(req.body.time) && req.body.time.length == 2){
//                 parameters['time'] = req.body.time[0] + ',' + req.body.time[1]
//             }else{
//                 parameters['time'] = req.body.time
//             }
//             parameters['limit']= req.body.limit
//             serverCon.GET(req.body.address, parameters, res)
//         }
//         else if (req.body.type == "1"){
//             console.log("Get TemporalProperties")
//             console.log(Array.isArray(req.body.time))
//             // parameters['name'] = req.body.name
//             if (Array.isArray(req.body.time) && req.body.time.length == 2){
//                 parameters['time'] = req.body.time[0] + ',' + req.body.time[1]
//             }else{
//                 parameters['time'] = req.body.time
//             }
//             parameters['limit']= req.body.limit
//             serverCon.GET(req.body.address, parameters, res)
//         }
//     }
// });
// module.exports = router;
