import mongoose from 'mongoose';
import Geofence from './schemas/geofenceSchema.js';

const Models = {
    Geofence: Geofence
};

const connectDB = () => {
    let host = process.env.MOTI_API_MONGO_DB_HOST || "localhost";
    console.log(`Connecting monogo @ ${host}`);
    return mongoose.connect(
        `mongodb://geostore-api:geostore-api@${host}:27017/geostore-db`
        , { 
            useNewUrlParser: true
            , useUnifiedTopology: true
            , useCreateIndex: true
        });
}

export {Models, connectDB};
export default Models;