import mongoose from 'mongoose'

const camerasSchema = new mongoose.Schema(
    {
        name : {
            type: String,
            required: true
        },
        caption:  String,
        orientation: String,
        altitude: Number,
        isOn: Boolean,
        geometry: {
            required: true,
            type: mongoose.Schema.Types.Object,
            properties: {
                type: {
                    type: mongoose.Schema.Types.String,
                    enum: ["Point", "LineString", "Polygon", "MultiPoint", "MultiLineString", "MultiPolygon"]
                },
                coordinates: {
                    type: mongoose.Schema.Types.Mixed
                }
            }
        },
        camera_id: Number,
    },
    {
        timestamps: {
            createdAt: 'created_on',
            updatedAt: 'updated_on'
        }
    }
);

camerasSchema.index({camera_id: 1}, {unique:true});
camerasSchema.index({geometry: "2dsphere"});


const Camera = mongoose.model("Camera", camerasSchema);
export default Camera;