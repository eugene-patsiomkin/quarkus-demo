import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema(
    {
        bid : {
            type: mongoose.Schema.Types.String,
            required: true,
            unique: true,
            index: true
        },
        schedule: {
            required: true,
            type: mongoose.Schema.Types.Array,
            validate: {
                validator: (v) => {
                    if (!v || v.length < 1)  throw new Error("Schedule can not be empty");

                    v.forEach((startEnd, idx) => {
                        startEnd.start = (new Date(startEnd.start)).toISOString();
                        startEnd.end = (new Date(startEnd.end)).toISOString();

                        if (startEnd.starts_on > startEnd.ends_by)
                            throw new Error(`Item ${idx + 1} starts_on should be before ends_by`);
                    });

                    return true;
                },
                message: props => {console.log(props); return props.reason.message;}
            },
            items: {
                type: mongoose.Schema.Types.Object,
                properties: {
                    start: {
                        type: Date,
                        required: true,
                        index: true,
                    },
                    end: {
                        type: Date,
                        required: true,
                        index: true,
                    }
                }
            }
        },
        type: {
            tags:{
                type: [mongoose.Schema.Types.String],
                validate: {
                    validator: v => v && v.length > 0,
                    message: "Can not be empty"
                },
                index: true
            },
            severity: {
                type: mongoose.Schema.Types.String,
                enum: ["MINOR", "MODERATE", "MAJOR", "UNKNOWN", "NORMAL"],
                default: "UNKNOWN",
                required: true
            },
            planned: mongoose.Schema.Types.Boolean,
            active: {
                type: mongoose.Schema.Types.Boolean,
                default: true,
                index: true
            }
        },
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
        info: {
            required: true,
            type: mongoose.Schema.Types.Object,
            properties: {
                headline: mongoose.Schema.Types.String,
                description: mongoose.Schema.Types.String,
                related_urls: [mongoose.Schema.Types.String]
            }
        },
    },
    {
        timestamps: {
            createdAt: 'created_on',
            updatedAt: 'updated_on'
        }
    }
);

eventSchema.index({geometry: "2dsphere"});

const Event = mongoose.model('Event', eventSchema);
export default Event;