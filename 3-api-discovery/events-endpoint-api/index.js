import express from "express";
import bodyParser from "body-parser";
import morgan from 'morgan';
import proxy  from 'express-http-proxy';
import {connectDB} from './src/db.js'
import Routes from "./src/routes/index.js";
import {swaggerDocument, swaggerUi} from './openapi/index.js'
import {bodyParserErrorHandler} from "./src/app.js"
import {ZipkinTracerMiddleware} from "./src/zipkin.js"

const app = express();
app.use(ZipkinTracerMiddleware);

const config = {
    name: "event api",
    port: process.env.MOTI_API_EVENTS_PORT || 38368,
    host: '0.0.0.0',
};

//Setting up logger
app.use(morgan('common'));

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Geostore proxy
let geostoreServer = process.env.MOTI_API_GEOSTORE_HOST || 'localhost';
app.use("/geofence", proxy(geostoreServer, {
    proxyReqPathResolver: function (req) {
        let parts = req.url.split('?');
        parts[0] = "/geofence" + parts[0];

        return parts.join("?");
      }    
}));

//Accept json
app.use(bodyParser.json({type: 'application/*+json'}));
app.use(bodyParser.json({type: 'application/json'}));

app.use(bodyParserErrorHandler);

// Health check endpoint
app.get('/ping', (req, res) => {
    res.status(200).json("pong");
});

Routes.forEach((route) => {
    app.use(route.path, route.route);
});

connectDB().then( async () => {
    app.listen(config.port, config.host, (e)=> {
        if(e) {throw new Error(e);}
        console.log(`${config.name} is running on port ${config.port}`);
    });
});