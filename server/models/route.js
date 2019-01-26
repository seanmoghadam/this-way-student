import mongoose from "mongoose";

mongoose.Promise = Promise;

const Schema = mongoose.Schema;

//mongoose route schema

const routeSchema = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    shortDescription: {
        type: String,
    },
    attractions: {
        type: Array,
    },
    duration: {
        type: Number,
    },
    distance: {
        type: Number,
    },
    endPoint: {
        type: String,
    },
    startPoint: {
        type: String,
    },
    ratings: {
        type: Array,
    }

}, {collection: "route", timestamps: true});

export default mongoose.model("route", routeSchema);
