import {requesterIsAdmin} from "../../../helpers/helpers";
import RouteModel from "../../../models/route";

export default {
    resolve(err, params, context) {
        if (requesterIsAdmin(context)) {
            return new Promise((resolve) => {
                const UserInput = params.input;
                let {title, description, duration, attractions, shortDescription, distance, startPoint, endPoint} = UserInput;
                let Route = new RouteModel();
                Route.description = description;
                Route.shortDescription = shortDescription;
                Route.title = title;
                Route.attractions = attractions;
                Route.duration = duration;
                Route.distance = distance;
                Route.startPoint = startPoint;
                Route.endPoint = endPoint;
                resolve(Route.save());
            });
        }
        else {
            return "unauthorized";
        }

    }
};