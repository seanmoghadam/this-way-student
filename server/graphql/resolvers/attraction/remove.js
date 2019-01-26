import {requesterIsAdmin} from "../../../helpers/helpers";
import AttractionModel from "../../../models/attraction";

export default {
    resolve(err, params, context) {
        if (requesterIsAdmin(context)) {
            return new Promise((resolve) => {
                AttractionModel.find({"_id": params.id}).remove(() => {
                    let attraction = {
                        _id: params.id
                    };
                    resolve(attraction);
                });
            });
        } else {
            return "unauthorized";
        }

    }
};