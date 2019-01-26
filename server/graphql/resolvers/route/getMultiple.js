import routeModel from "../../../models/route";

export default {
    resolve() {
        return new Promise(resolve => {
            routeModel.find().exec().then((routes) => {
                resolve(routes);
            });
        });

    }
};