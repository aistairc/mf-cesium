// const request = require('request')
const FormData = require('form-data');
// const request2 = require('request-promise-native');
const querystring = require('querystring');
const request = require('request')
// const fetch = require('node-fetch')
// const needle = require('needle')
const axios = require('axios')
// const http = require('http')
const express = require('express');
let token;
let session_id;
let access_token;
let ServerOn = false;

function ConnectFunction () {
    // this.token;
    // this.session_id;
    this.ServerOn2 = false;
    this.__cookies = ""
}


ConnectFunction.prototype.GET = async function (address, parameters, res){

    let options = {
        url: address,
        method: 'GET',
        qs: parameters,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    }
    request(options, function(err,response,body){

        if(response != undefined){ 
            if (response.statusCode == 200 || response.statusCode == 202){
                
                res.json({ok: true, data: JSON.parse(response.body)});
            
            }else{
                // console.log(tempdata)
                // console.log(response.body)
                res.json({ok: false});
            
            }
        }else{
            res.json({ok: false});
        }
       
    });
}


ConnectFunction.prototype.POST = function (address, parameters, res){

    let options = {
        url: address,
        method: 'POST',
        data: parameters,
        headers: {
            'Content-Type': 'application/geo+json',
            'Accept': '*/*',
        }
    }
    request(options, function(err,response,body){
        // var tempdata = JSON.parse(response.body)
   
        if(response != undefined){ 
            if (response.statusCode == 200 || response.statusCode == 202){
                
                res.json({ok: true, data: JSON.parse(response.body)});
            
            }else{
                // console.log(tempdata)
                // console.log(response.body)
                res.json({ok: false});
            
            }
        }else{
            res.json({ok: false});
        }
    });
}

ConnectFunction.prototype.callback = function(callbackValue){
    return callbackValue
}
module.exports = new ConnectFunction()
