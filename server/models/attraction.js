import mongoose from "mongoose";

mongoose.Promise = Promise;

const Schema = mongoose.Schema;

//mongoose attraction schema

const attractionSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    images: {
        type: Array,
        required: true
    },
    audioFiles: {
        type: Array,
        required: true
    },
    ratings: {
        type: Array,
    }


}, {collection: "attraction", timestamps: true});

export default mongoose.model("attraction", attractionSchema);
