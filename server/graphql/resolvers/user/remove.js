import {requesterIsAdmin} from "../../../helpers/helpers";
import UserModel from "../../../models/user";

export default {
    resolve(err, params, context) {
        if (requesterIsAdmin(context)) {
            return new Promise((resolve) => {
                UserModel.find({"_id": params.id}).remove(() => {
                    let user = {
                        _id: params.id
                    };
                    resolve(user);
                });
            });
        } else {
            return "unauthorized";
        }

    }
};