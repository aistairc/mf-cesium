# STINUUM (Spatio-Temporal continua on Cesium)

STINUUM is a JavaScript library to visualize and analyze moving objects on [Cesium](https://cesiumjs.org).
STINUUM imports OGC Moving Features JSON data and supports animated maps as well as static maps and a space-time cube for navigating the trajectory of moving objects over space and time. The main characteristics of STINUUM are as follows:
- Diverse geometry types to represent movements
- Multiscale data analysis in space and time
- Highly accessibility and lightweight deployment

## OGC Moving Features Encoding Extension - JSON
The current version of STINUUM allows only the [OGC Moving Features JSON format](https://docs.opengeospatial.org/is/19-045r3/19-045r3.html). 

About the data format, please refer to [it](https://docs.opengeospatial.org/is/19-045r3/19-045r3.html#_moving_features_json_encodings).
- - -

## Tech/Framework used

    Built with Node.js 10.x (we test it with 10.20.1)

## Installation

    Don't need to build

## Development Your Program

Download stinuum.js and add ``` <script src="stinuum.js"></script>``` to your a html file.
- - -

## How to use?

1. Clone this project.
  ```
  $ git clone http://github.com/aistairc/mf-cesium
  ```
2. Install Node.js and run the following command to install the dependencies at the previous folder :
  ```
  $ cd Stinuum Web
  $ npm install
  ```
3. If you have BingMapsApi Key, add it to __/Stinuum Web/views/demo.ejs__ file. 
  ```js
  /* line 183 */
  defaultKey = "your_BingMapsApi Key"
  ```
4. Start Cesium server
  ```
  $ node app.js
  ```
5. Enter http://localhost:8080 on your browser (Recommend [Chrome](https://www.google.com/intl/ko/chrome/)).
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

STINUUM licensed under the [MIT](https://github.com/aistairc/mf-cesium/blob/master/LICENSE)

- - -  
