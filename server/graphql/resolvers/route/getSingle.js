import regex from "../../../../common/regex";
import routeModel from "../../../models/route";

export default {
    resolve(err, params) {
        const routeId = params.id;
        if (params.id.match(regex.objectId)) {
            return routeModel.findOne({"_id": routeId}).exec().then((route) => {
                if (route) {
                    return route;
                } else return null;
            });
        } else return null;


    }
};