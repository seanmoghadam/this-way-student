import {pick} from "ramda";
import validator from "validator";
import userModel from "../../../models/user";

export default {
    resolve(err, params) {
        params.email = params.email.toLowerCase();
        if (validator.isEmail(params.email)) {
            return userModel.findOne(params).exec().then((user) => {
                if (user) {
                    return pick(["email"], user);//Only what user is allowed to see
                } else return null;
            });
        }
        else return null;
    }
};