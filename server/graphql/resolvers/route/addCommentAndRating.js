import {getIdFromHeaderToken, requesterIsUser} from "../../../helpers/helpers";
import RouteModel from "../../../models/route";
import moment from "moment";

const createDOMPurify = require("dompurify");
const {JSDOM} = require("jsdom");
const window = (new JSDOM("")).window;
const DOMPurify = createDOMPurify(window);

export default {
    resolve(err, params, context) {
        if (requesterIsUser(context)) {
            let {comment,  routeId} = params;
            comment = DOMPurify.sanitize(comment);

            const userId = getIdFromHeaderToken(context);
            return new Promise((resolve) => {
                RouteModel.findOne({"_id": routeId}, (err, route) => {
                    if(err){
                        console.info(err);
                    } else if(route){
                        let oldRating = route.ratings.find(rating => rating.userId === userId);
                        if (oldRating) {
                            oldRating.rating = params.rate;
                            oldRating.comment = comment;
                            oldRating.created_at = moment().unix();
                            route.markModified("ratings");
                            route.save((e) => {
                                if(e) console.error('error saving data: ', e.message);
                            });
                            resolve(route);
                        } else {
                            route.ratings.push({
                                rating: params.rate,
                                comment,
                                userId,
                                created_at: moment().unix()
                            });
                            route.save((e) => {
                                if(e) console.error('error saving data: ', e.message);
                            });
                            resolve(route);
                        }
                    } else return null;
                });
            });
        } else return null;
    }
};