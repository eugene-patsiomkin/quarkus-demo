import mongoose from 'mongoose'

const geofenceSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.String,
        tags : {
            type: mongoose.Schema.Types.Array,
            required: true,
            validate: {
                validator: v => v && v.length > 0,
                message: "Can not be empty"
            },
            items: {
                type: mongoose.Schema.Types.String
            },
            index: true
        },
        radius: {
            type: mongoose.Schema.Types.Number,
            default: 0,
            min: 0
        },
        geometry: {
            type: mongoose.Schema.Types.Object,
            properties: {
                type: {
                    type: String,
                    enum: ["Point", "LineString", "Polygon", "MultiPoint", "MultiLineString", "MultiPolygon"]
                },
                coordinates: {
                    type: mongoose.Schema.Types.Mixed
                }
            }
        },
        description: {
            type: mongoose.Schema.Types.String,
        }
    },
    {
        timestamps: {
            createdAt: 'created_on',
            updatedAt: 'updated_on'
        }
    }
);


const Geofence = mongoose.model("Geofence", geofenceSchema);
export default Geofence;