import {requesterIsAdmin} from "../../../helpers/helpers";
import RouteModel from "../../../models/route";

export default {
    resolve(err, params, context) {
        if (requesterIsAdmin(context)) {
            return new Promise((resolve) => {
                const UserInput = params.input;
                let {title, description, duration, attractions, shortDescription, distance, startPoint, endPoint, id} = UserInput;
                RouteModel.findOne({"_id": id}, function (err, route) {
                    if (err) console.error(err);
                    route.description = description;
                    route.shortDescription = shortDescription;
                    route.title = title;
                    route.attractions = attractions;
                    route.duration = duration;
                    route.distance = distance;
                    route.startPoint = startPoint;
                    route.endPoint = endPoint;
                    route.save(function (err, updatedRoute) {
                        if (err) console.error(err);
                        resolve(updatedRoute);
                    });
                });
            });
        }
        else {
            return "unauthorized";
        }

    }
};