import mongoose from 'mongoose'

const tagSchema = new mongoose.Schema(
    {
        id : {
            type: mongoose.Schema.Types.String,
            validate: {
                validator: v => v && v.length > 0,
                message: "Can not be empty"
            },
            required: true,
            unique: true,
            index: "text"
        },
        type: {
            type: mongoose.Schema.Types.String,
            validate: {
                validator: v => v && v.length > 0,
                message: "Can not be empty"
            },
            required: true,
            index: "text"
        },
        description: {
            type: mongoose.Schema.Types.String,
        },
        level: {
            type: mongoose.Schema.Types.Number,
            enum: [1, 2, 3, 4],
            default: 1
        }
    },
    {
        timestamps: {
            createdAt: 'created_on',
            updatedAt: 'updated_on'
        }
    }
);

const Tag = mongoose.model("Tag", tagSchema);
export default Tag;