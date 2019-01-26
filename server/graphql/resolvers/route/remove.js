import {requesterIsAdmin} from "../../../helpers/helpers";
import RouteModel from "../../../models/route";

export default {
    resolve(err, params, context) {
        if (requesterIsAdmin(context)) {
            return new Promise((resolve) => {
                RouteModel.find({"_id": params.id}).remove(() => {
                    let route = {
                        _id: params.id
                    };
                    resolve(route);
                });
            });
        } else {
            return "unauthorized";
        }

    }
};