import {pick} from "ramda";
import {requesterIsAdmin} from "../../../helpers/helpers";
import UserModel from "../../../models/user";

export default {
    resolve(err, params, context) {
        if (requesterIsAdmin(context)) {
            return UserModel.findOne({"_id": params.id}).exec();
        }
        else {
            return UserModel.findOne({"_id": params.id}).exec().then((user) => {
                return pick(["forename", "surname", "routes", "createdAt", "updatedAt"], user);
                //Only what user is allowed to see upper data
            });
        }
    }
};