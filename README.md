# STINUUM (Spatio-Temporal continua on Cesium)

STINUUM is a JavaScript library to visualize and analyze moving objects on [Cesium](https://cesiumjs.org).
STINUUM imports OGC Moving Features JSON data and supports animated maps as well as static maps and a space-time cube for navigating the trajectory of moving objects over space and time. The main characteristics of STINUUM are as follows:

- Diverse geometry types to represent movements
- Multiscale data analysis in space and time
- Highly accessibility and lightweight deployment

## OGC Moving Features Encoding Extension - JSON

The current version of STINUUM supports only the [OGC Moving Features JSON format](https://docs.opengeospatial.org/is/19-045r3/19-045r3.html).

The OGC Moving Features JSON format is described in [OGC 19-045r3 Section 7](https://docs.opengeospatial.org/is/19-045r3/19-045r3.html#_moving_features_json_encodings).
- - -

## Tech/Framework used

Built with Node.js v10.x ~ 16.x (we test using 16.14.2)

## Dependency

* [![Node.JS][node-shield]][node-js-url]
* [![NPM][npm-shield]][npm-js-url]
* [![Cesium][cesium-shield]][cesium-js-url]

- - -

## Local setup

1. Clone this project.

```sh
git clone http://github.com/aistairc/mf-cesium
```

2. Install Node.js (and npm) and run the following command to install the dependencies at the previous folder :

```sh
cd /path/to/mf-cesium/Stinuum\ Web
# Check if file package.json and package-lock.json exist
npm install
```

3. Start Cesium server

```sh
node app.js
```

4. Enter http://localhost:8080 in your browser. We recommend [Chrome](https://www.google.com/intl/ko/chrome/).

5. Load Moving Features data using drag-and-drop. We provide sample files in ```Stinuum\ Web/data```.

6. This version can be used in conjunction with MF-API & MF-Server
- You can simply build [![MF-API][github-shield]][mf-server-url] on your local PC using Docker
```shell
docker pull timeocarina/mf-api-server:latest
# docker run -p MF-Server-API-Port:MF-Server-API-Port -p Postresql-Port:Postresql-Port -d --name mf-api-server timeocarina/mf-api-server
docker run -p 8085:8085 -p 25432:5432 -d --name mf-api-server timeocarina/mf-api-server
docker exec mf-api-server ./run.sh
```
> [!IMPORTANT]  
> If you change the __MF-Server-API-Port__, please change the code below  
> (Will be controlled later with config.yml file)  
> [![ServerAuth.js][js-shield]][serverauth-url]: this.ServerURL = "http://localhost:8085" ⮕ "http://localhost:__*YOUR-PORT*__"  
> [![dataSelect.ejs][ejs-shield]][dataselect-url]: defaultURL: "http://localhost:8085" ⮕ "http://localhost:__*YOUR-PORT*__"  
> [![MFAPIHandler][py-shield]][mfapihandler-url]: base_url = "http://localhost:8085" ⮕ "http://localhost:__*YOUR-PORT*__"    

- And then you can connect to the homepage with the below URL:
- http://localhost:8085
- For detailed usage of the API, please go to the link below
- [![MF-API-Redoc][redoc-shield]][mf-api-redoc]

7. We enclose a python program that allows you to upload large amounts of data using the MF-API
   - Please refer to [MFAPIHandler](https://github.com/aistairc/mf-cesium/tree/mf-cesium_api/MFAPIHandler)
- - -

## API Reference

STINUUM API document is [here](https://github.com/aistairc/mf-cesium/wiki/API-Reference)

## Manual

Usage of Stinuum Web is [here](https://github.com/aistairc/mf-cesium/wiki/Stinuum-Web-Manual)

- - -
## Maintainer

- Wijae Cho, cho-wijae@aist.go.jp
- Taehoon Kim, kim.taehoon@aist.go.jp
- Kyoung-Sook Kim, ks.kim@aist.go.jp

## License

STINUUM is licensed under the [MIT license](https://github.com/aistairc/mf-cesium/blob/master/LICENSE)

---



[github-shield]: https://img.shields.io/badge/MF_API-181717?style=flat&logo=github&logoColor=white
[mf-server-url]: https://github.com/aistairc/mf-api
[mf-api-swagger]: http://localhost:8085/openapi?f=html
[swagger-shield]: https://img.shields.io/badge/MF_API_Swagger-85EA2D?style=flat&logo=Swagger&logoColor=white
[mf-api-redoc]: http://localhost:8085/openapi?f=html&ui=redoc
[redoc-shield]: https://img.shields.io/badge/MF_API_Redoc-8CA1AF?style=flat&logo=readthedocs&logoColor=white
[node-js-url]: https://nodejs.org/
[node-shield]: https://img.shields.io/badge/Node.js_v16.14.2-339933?style=flat&logo=Node.js&logoColor=white
[npm-js-url]: https://www.npmjs.com/
[npm-shield]: https://img.shields.io/badge/NPM_v8.5.0-CB3837?style=flat&logo=npm&logoColor=white
[cesium-js-url]: https://github.com/CesiumGS/cesium
[cesium-shield]: https://img.shields.io/badge/Cesium_v1.73-6CADDF?style=flat&logo=Cesium&logoColor=white
[js-shield]:  https://img.shields.io/badge/ServerAuth.js-F7DF1E?style=flat&logo=javascript&logoColor=white
[serverauth-url]: https://github.com/aistairc/mf-cesium/blob/mf-cesium_api/Stinuum%20Web/src/js/mf-cesium/ServerAuth.js

[ejs-shield]:  https://img.shields.io/badge/dataSelect.ejs-E34F26?style=flat&logo=html5&logoColor=white
[dataselect-url]: https://github.com/aistairc/mf-cesium/blob/mf-cesium_api/Stinuum%20Web/views/dataSelect.ejs

[py-shield]: https://img.shields.io/badge/MFAPIHandler.py-3776AB?style=flat&logo=python&logoColor=white
[mfapihandler-url]: https://github.com/aistairc/mf-cesium/blob/mf-cesium_api/MFAPIHandler/MFAPIHandler.py
