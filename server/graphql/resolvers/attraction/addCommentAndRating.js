import {getIdFromHeaderToken, requesterIsUser} from "../../../helpers/helpers";
import AttractionModel from "../../../models/attraction";
import moment from "moment";


const createDOMPurify = require("dompurify");
const {JSDOM} = require("jsdom");
const window = (new JSDOM("")).window;
const DOMPurify = createDOMPurify(window);

export default {
    resolve(err, params, context) {
        if (requesterIsUser(context)) {
            let {comment,  attractionId} = params;
            comment = DOMPurify.sanitize(comment);

            const userId = getIdFromHeaderToken(context);
            return new Promise((resolve) => {
                AttractionModel.findOne({"_id": attractionId}, (err, attraction) => {
                    if(err){
                        console.info(err);
                    } else if(attraction){
                        let oldRating = attraction.ratings.find(rating => rating.userId === userId);
                        if (oldRating) {
                            oldRating.rating = params.rate;
                            oldRating.comment = comment;
                            oldRating.created_at = moment().unix();
                            attraction.markModified("ratings");
                            attraction.save((e) => {
                                if(e) console.error('error saving data: ', e.message);
                            });
                            resolve(attraction);
                        } else {
                            attraction.ratings.push({
                                rating: params.rate,
                                comment,
                                userId,
                                created_at: moment().unix()
                            });
                            attraction.save((e) => {
                                if(e) console.error('error saving data: ', e.message);
                            });
                            resolve(attraction);
                        }
                    } else return null;
                });
            });
        } else return null;
    }
};