import mongoose from "mongoose";

mongoose.Promise = Promise;

const Schema = mongoose.Schema;

//mongoose user schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    forename: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        required: false,
        default: false
    },
    token: {
        type: String,
        required: false,
    },
    routes: {
        type: Array,
    }
}, {collection: "user", timestamps: true});

export default mongoose.model("user", userSchema);
