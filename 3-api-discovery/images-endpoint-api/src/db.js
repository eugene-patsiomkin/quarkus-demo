import mongoose from 'mongoose';
import Camera from './schemas/camerasSchema.js';

const Models = {
    Camera: Camera
};

const connectDB = () => {
    let host = process.env.MOTI_API_MONGO_DB_HOST || "localhost";
    console.log(`Connecting monogo @ ${host}`);
    return mongoose.connect(
        `mongodb://images-api:images-api@${host}:27017/images-db`
        , { 
            useNewUrlParser: true
            , useUnifiedTopology: true
            , useCreateIndex: true
        });
}

export {Models, connectDB};
export default Models;