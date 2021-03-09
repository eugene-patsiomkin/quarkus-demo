import express from "express";
import _isArray from 'lodash/isArray.js'
import js2xmlparser  from "js2xmlparser";
import Models from '../db.js'
import { NotFoundError, ControllerErrorHandler as handleError } from '../errors.js'
import { query_builder } from "../helpers/event_helper.js";

const eventRouter = express.Router();
const Event = Models.Event;

const EventsToXML = (evt) => {
    let getXMLEvent = e => js2xmlparser.parse("event", e).replace(/<\?xml.*\?>/i, '');
    let xml = '<?xml version="1.0"?>'
    evt = JSON.parse(JSON.stringify(evt));
    if (!_isArray(evt)) {
        xml += getXMLEvent(evt);
    } else {
        xml+='<events>'
        evt.forEach(e => xml += getXMLEvent(e));
        xml+="</events>"
    }

    return xml;
};

const EventsToJeoJSONString = (evts) => {
    let mapEventToGeoJSON = e => {
        e.geometry = e.geometry || {};
        let feature = {
            type: "Feature",
            geometry: {... e.geometry},
            properties: {... e}
        }

        delete feature.properties.geometry;
        return feature;
    }

    let result;
    if (_isArray(evts)) {
        result = {
            type: "FeatureCollection",
            features: evts.map(mapEventToGeoJSON)
        }
    } else {
        result = mapEventToGeoJSON(evts);
    }

    return JSON.stringify(result);
}

const mapEventResponse = (req) => {
    let result = {content_type: null, data: null};
    switch (true) {
        case req.accepts("application/geo+json") == "application/geo+json":
            result.content_type = 'application/geo+json';
            result.data = EventsToJeoJSONString(req.moti.events);
            break;
        case req.accepts("json") == "json":
            result.content_type = 'application/json';
            result.data = JSON.stringify(req.moti.events);

            break;
        case req.accepts("xml") == "xml":
            result.content_type = 'application/xml';
            result.data = EventsToXML(req.moti.events);
            break;
        default:
            result.content_type = 'application/json';
            result.data = JSON.stringify(req.moti.events);
    }

    return result;
}

const mapEventSuccess = (req, res, next) => {
    let data = mapEventResponse(req);
    res.status(200)
        .header('Content-Type', data.content_type)
        .send(data.data);

    delete(req.moti);
    next();
}

eventRouter.get('/', (req, res, next) => {
    query_builder(req.query)
        .then((searchQuery) => {
            console.log(searchQuery);
            return Event.find(searchQuery).lean(true).exec();
        })
        .then(events => {
            if (!events || events == [])  throw new NotFoundError("Events not found");
            req.moti = {events: events};
            next();
        })
        .catch((err) => handleError(err, res));
}, mapEventSuccess);

eventRouter.get('/:bid', (req, res, next) => {
    Event.findOne({bid: req.params.bid}).lean(true).exec()
    .then(events => {
        if (!events || events == [])  throw new NotFoundError("Event not found");
        req.moti = {events: events};
        next();
    })
    .catch((err) => handleError(err, res));
}, mapEventSuccess);

eventRouter.post("/", (req, res) => {
    let evt = new Event(req.body)
    evt.save()
        .then(event => {
            res.status('200').json(event).end()
        })
        .catch((err) => handleError(err, res));
});

eventRouter.put("/:bid", (req, res, next) => {
    let updateEvent = (event, newEvent) => {
        if (!event) throw new NotFoundError("Event not found");
        if (newEvent.schedule) event.set("schedule", newEvent.schedule);
        if (newEvent.type) event.set("type", newEvent.type);
        if (newEvent.geometry) event.set("geometry", newEvent.geometry);
        if (newEvent.info) event.set("info", newEvent.info);
    
        return event.save();
    }
    
    Event.findOne({bid: req.params.bid}).exec()
        .then((event) => updateEvent(event, req.body))
        .then(event => {
            res.status('200').json(event).end();
            next();
        })
        .catch((err) => handleError(err, res));
});


eventRouter.delete("/:bid", (req, res) => {
    let deleteEvent = (event) => {
        if (!event) throw new NotFoundError("Event not found");

        return event.remove();
    };

    Event.findOne({ bid: req.params.bid})
        .exec()
        .then((event) => deleteEvent(event))
        .then(event => {
            res.status('200').json(event).end();
        })
        .catch((err) => handleError(err, res));
});

export default eventRouter;