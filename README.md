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

Built with Node.js 10.x (we test using 10.20.1)

## Installation

Installation is not required - see below for local setup.

## Using in your application

Download stinuum.js and add ```<script src="stinuum.js"></script>``` to your HTML file.
- - -

## Local setup

1. Clone this project.

   ```sh
   git clone http://github.com/aistairc/mf-cesium
   ```

2. Install Node.js (and npm) and run the following command to install the dependencies at the previous folder :

   ```sh
   cd Stinuum\ Web
   npm install
   ```

3. If you have BingMapsApi Key, add it to __/Stinuum Web/views/demo.ejs__ file.

   ```js
   /* line 183 */
   defaultKey = "your_BingMapsApi Key"
   ```

4. Start Cesium server

   ```sh
   node app.js
   ```

5. Enter http://localhost:8080 in your browser. We recommend [Chrome](https://www.google.com/intl/ko/chrome/).

6. Load Moving Features data using drag-and-drop. We provide sample files in ```Stinuum\ Web/data```.

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

- - -  
