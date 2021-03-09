import express from "express";
import bodyParser from "body-parser";
import morgan from 'morgan';
import {connectDB} from './src/db.js'
import Routes from "./src/routes/index.js";
import {swaggerDocument, swaggerUi} from './openapi/index.js'
import {bodyParserErrorHandler} from "./src/app.js"
import zipkin from 'zipkin';
import {Tracer, ExplicitContext, BatchRecorder} from 'zipkin';
import {HttpLogger} from 'zipkin-transport-http';
import expMiddleware from 'zipkin-instrumentation-express';

const JsonEncoder = zipkin.jsonEncoder.JSON_V2;
const zipkinMiddleware = expMiddleware.expressMiddleware;
const ctxImpl = new ExplicitContext();
const zipkinEndpointHost = process.env.MOTI_ZIPKIN_HOST || 'localhost'
const recorder = new BatchRecorder({
    logger: new HttpLogger({
        jsonEncoder: JsonEncoder
        , endpoint: `http://${zipkinEndpointHost}:9411/api/v2/spans`
    })
});
const localServiceName = 'geostore-api-v1'; // name of this application
const tracer = new Tracer({ctxImpl, recorder, localServiceName});


const app = express();
app.use(zipkinMiddleware({tracer}));

const config = {
    name: "geostore api",
    port: process.env.MOTI_API_GEOSTORE_PORT || 7763,
    host: '0.0.0.0',
};

//Setting up logger
app.use(morgan(':method :url :status [:res[content-type]] :res[content-length] bytes - :response-time ms'));

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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