import R from "ramda";
import {requesterIsAdmin} from "../../../helpers/helpers";
import userModel from "../../../models/user";

export default {
    resolve(err, params, context) {
        if (requesterIsAdmin(context)) {
            return userModel.find().exec();
        } else {
            return userModel.find().exec().then((users) => {
                return users.map(user => {
                    return R.pick(["forename", "surname", "routes", "createdAt", "updatedAt"], user);
                });
                // allowed to see is the  upper data
            });
        }

    }
};
