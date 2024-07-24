# ConnectFunction.js

It is the Module to connect between Nodejs and Server.

```js
const serverConnect = require('./ConnectFunction');
serverConnect.ServerLogin(address, name, password, res);
serverConnect.GET(address, parameters, res);
serverConnect.POST(address, parameters, res);
```

## Methods

* __ServerLogin(address, name, password, res)__

Log-in the Server using the address, name and password

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
| address | String || Address to login the server |
| name | String || Username |
| password | String || Password |
| res | Object || response object of nodejs |

Example:
```js
...
const serverConnect = require('./ConnectFunction');
app.post("/YourPage", function(request, response){
    serverConnect.ServerLogin(request.body.address, request.body.name, request.body.password, response)
});
```

&nbsp;

* __GET(address, parameters, res)__

Get the data using the address and parameters from the server

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
| address | String || Address to get the data |
| parameters | Object || Data is required by the server |
| res | Object ||response object of nodejs |

Example:
```js
...
const serverConnect = require('./ConnectFunction');
app.post("/YourPage", function(request, response){
    serverConnect.GET(request.body.address, parameters, response)
});
```

&nbsp;

* __POST(address, parameters, res)__

Post the data using address and parameters into the server

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
| address | String || Address to get the data |
| parameters | Object || Data is required by the server |
| res | Object ||response object of nodejs |

Example:
```js
...
const serverConnect = require('./ConnectFunction');
app.post("/YourPage", function(request, response){
    serverConnect.POST(request.body.address, parameters, response)
});
```
&nbsp;