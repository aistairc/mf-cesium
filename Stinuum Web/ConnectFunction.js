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

// function getCookie (data, name) {
//     for(var i in data){
//       var value = data[i].match('(^|;) ?' + name + '=([^;]*)(;|$)');
//
//       if (value){
//         if (value[2] != ''){
//
//             return value[2]
//         }
//       }else{
//         continue
//       }
//     }
//     return null
// }
// ConnectFunction.prototype.callback = function(callback){
//     console.log(callback)
//     return callback
// }
// ConnectFunction.prototype.get_url = function (url, path_info){
//     if (path_info === null){
//         return url;
//     }
//     else{
//         return url+path_info;
//     }
// }

// ConnectFunction.prototype.getCrsf = async function (address) {
//     let url = address + this.__path_csrf
//     return await axios(url).catch(error => { throw error})
// }

// ConnectFunction.prototype.login = async function (address, name, password) {
//
//     const result = await this.getCrsf(address).catch(error => { throw error})
//     let tempToken = result.data
//     let url = address + this.__path_login
//     const loginData = {
//         name: name,
//         password: password
//     }
//     const option = {
//         method: 'POST',
//         url: url,
//         data: querystring.stringify(loginData),
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//             'Accept': '*/*',
//         }
//     }
//     return  await axios(option).catch(error => {
//             throw error
//         })
//
// }
// ConnectFunction.prototype.getAuthCode = async function (address, name, password) {
//     let loginResult = await this.login(address, name, password).catch(error => {throw error})
//     const loginCookie = loginResult.headers['set-cookie']
//     console.log("Start getAuthCode function")
//     token = getCookie(loginCookie, 'XSRF-TOKEN')
//     session_id = getCookie(loginCookie, 'SESSION')
//     const authData = {
//         client_id: this.LOGIN_CLIENT_ID,
//         response_type: "code"
//     }
//     let authURL = address + this.__path_oauth + querystring.stringify(authData)
//
//     const option2 = {
//         method: 'GET',
//         url: authURL,
//         headers: {
//             'Cookie': "XSRF-TOKEN="+token + ";SESSION="+session_id+";"
//         }
//     }
//     let authCode = ""
//     await axios(option2).catch(response => {
//         // console.log(JSON.stringify(response.request))
//         authCode = response.request['_options']['query']
//     })
//     console.log("last", authCode.slice(5))
//     return authCode.slice(5)
// }
// ConnectFunction.prototype.ServerLogin = async function (address, name, password, res) {
//     let authCode = await this.getAuthCode(address, name, password).catch(error => {throw error})
//     console.log(authCode)
//     const tokenURL = address+this.__path_token
//     let client_id = this.LOGIN_CLIENT_ID
//     let client_secret = this.LOGIN_CLIENT_SECRET
//     let redirect_uri = this.LOGIN_REDIRECT_URI
//     let option3 = {
//         method: 'POST',
//         url: tokenURL,
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
//         body: querystring.stringify({
//             client_id,
//             client_secret,
//             code: authCode,
//             grant_type: 'authorization_code'
//         })
//     }
//     let getTokenResult;
//     await fetch(tokenURL, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: querystring.stringify({
//             client_id,
//             client_secret,
//             code: authCode,
//             grant_type: 'authorization_code'
//         })
//     }).then(res => res.json()).then(json => {getTokenResult = json})
//     this.ServerOn2 = true
//     access_token = getTokenResult["access_token"]
//     console.log(this.ServerOn2, token, session_id, getTokenResult["access_token"])
//     res.json({ok: true, server: this.ServerOn2, token: token, session_id: session_id})
// }
// ConnectFunction.prototype.ServerLogin = function (address, name, password, res){
//     let loginAddress = address+'/pntml2/csrf/' + 'client_id='+this.LOGIN_CLIENT_ID+'&response_type=code'
//     let options = {
//         url: loginAddress,
//         method: 'GET',
//     }
//     request(options, function(error, response, body) {
//
//         if (response.statusCode == 200 || response.statusCode == 202){
//             var cookies = response.headers['set-cookie'];
//             var tempToken = response.body;
//             console.log(cookies)
//             const form = {
//                 'name': name,
//                 'password': password
//             }
//             let options2 = {
//                 url: address+'/pntml2/login',
//                 method: 'POST',
//                 form: form,
//                 // headers: {
//                 //     'Content-Type': 'application/x-www-form-urlencoded',
//                 //     'X-XSRF-TOKEN': tempToken,
//                 //     'Accept': '*/*',
//                 //     'Cookie': "XSRF-TOKEN="+tempToken
//                 // },
//                 headers: {
//                     'X-XSRF-TOKEN': tempToken
//                 },
//                 cookies: {
//                     'Cookie': "XSRF-TOKEN="+tempToken
//                 }
//             }
//             request(options2, function(err,response,body){
//
//                 // console.log(response.headers['set-cookie']);
//                 if (response.statusCode == 200 || response.statusCode == 202){
//
//                     var loginCookie = response.headers['set-cookie']
//                     token = getCookie(loginCookie, 'XSRF-TOKEN')
//                     console.log(token)
//                     session_id = getCookie(loginCookie, 'SESSION')
//                     ServerOn = true
//                     res.json({ok: true, server: ServerOn, token: token, session_id: session_id})
//
//                 }else{
//                     res.json({ok: false,
//                         server: ServerOn})
//
//                 }
//             });
//         }
//     });
// }
ConnectFunction.prototype.GET = async function (address, parameters, res){
    // console.log(address)
    // console.log(parameters)
    // let token = parameters.token
    // let session_id = parameters.session_id
    // delete parameters.token;
    // delete parameters.session_id;
    // console.log(token, session_id, access_token)
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
        // console.log(response)
        // console.log(response.body)
        // console.log(response)
        // var tempdata = JSON.parse(response.body)
        // console.log(response)
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
    // var token = parameters.token
    // var session_id = parameters.session_id
    // delete parameters.token;
    // delete parameters.session_id;
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
// ConnectFunction.prototype.getMFcollections = function (address, res){
//     console.log("here")
//     console.log(token)
//     console.log(session_id)
//     let options = {
//         url: address,
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             'X-XSRF-TOKEN': token,
//             'Accept': '*/*',
//             'Cookie': "SESSION="+session_id+";"+" XSRF-TOKEN="+token
//         }
//     }
//     request(options, function(err,response,body){
//         // console.log(err)
//         if (response.statusCode == 200){
//             tempdata = JSON.parse(response.body)
//             res.json({ok: true,
//                 data: JSON.parse(response.body)});
//         }
//     });
   
// }
// ConnectFunction.prototype.getFeatureKeys = function (address, res){
//     let options = {
//         url: address,
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             'X-XSRF-TOKEN': token,
//             'Accept': '*/*',
//             'Cookie': "SESSION="+session_id+";"+" XSRF-TOKEN="+token
//         }
//     }
//     request(options, function(err,response,body){
//         // console.log(err)
//         console.log(response)
//         if (response.statusCode == 200){
//             console.log(response)
//             console.log(response.body)
//         }
//     });
    
// }
ConnectFunction.prototype.callback = function(callbackValue){
    return callbackValue
}
module.exports = new ConnectFunction()
