import attractionModel from "../../../models/attraction";
import regex from "../../../../common/regex";

export default {
    resolve(err, params) {
        if (params.id.match(regex.objectId)) {
            return attractionModel.findOne({"_id": params.id}).exec().then((attraction) => {
                if(attraction){
                    return attraction;
                } else return null;
            });
        } else return null;


    }
};