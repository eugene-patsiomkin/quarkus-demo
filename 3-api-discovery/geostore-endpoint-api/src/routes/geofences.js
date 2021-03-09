import express from "express";
import mongoose from 'mongoose'
import Geofence from "../schemas/geofenceSchema.js";
import { ControllerErrorHandler, NotFoundError } from "../errors.js";

const geoRouter = express.Router();

geoRouter.get("/", (req, res) => {
    Geofence.find()
        .lean(true).exec()
        .then(geofence => {
            if (!geofence || geofence == [])  throw new NotFoundError("Geofences not found");

            res.json(geofence).status(200);
        })
        .catch((err) => ControllerErrorHandler(err, res));
});

geoRouter.get("/by-tag/:tag", (req, res) => {
    Geofence.find({tags : req.params.tag})
        .lean(true).exec()
        .then(geofence => {
            if (!geofence || geofence == [])  throw new NotFoundError("Geofences not found");

            res.json(geofence).status(200);
        })
        .catch((err) => ControllerErrorHandler(err, res));
});

geoRouter.get('/:id', (req, res) => {
    Geofence.findById(req.params.id).lean(true).exec()
        .then(geofence => {
            if (!geofence || geofence == [])  throw new NotFoundError("Geofence not found");

            res.json(geofence).status(200);
        })
        .catch((err) => ControllerErrorHandler(err, res));
});

geoRouter.post('/', (req, res) => {

    let geofenceDb = new Geofence(req.body);

    geofenceDb.save()
        .then(geofence => {
            res.json(geofence).status(200);
        })
        .catch((err) => ControllerErrorHandler(err, res));
});


geoRouter.delete("/:id", (req, res) => {
    let deleteGeofence = (geofence) => {
        if (!geofence) throw new NotFoundError("Geofence not found");

        return geofence.remove();
    };

    Geofence.findById(req.params.id)
        .exec()
        .then((geofence) => deleteGeofence(geofence))
        .then(() => {
            res.status('200').json("Geofence deleted").end();
        })
        .catch((err) => ControllerErrorHandler(err, res));
});

export default geoRouter;