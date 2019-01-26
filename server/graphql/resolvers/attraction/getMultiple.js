import attractionModel from "../../../models/attraction";

export default {
    resolve() {
        return new Promise(resolve => {
            attractionModel.find().exec().then((attractions) => {
                resolve(attractions);
            });
        });

    }
};