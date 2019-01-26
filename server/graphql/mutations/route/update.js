import {GraphQLNonNull} from "graphql";
import routeResolver from "../../resolvers/route/index";
import {routeInputType, routeType} from "../../types/route";

export default {
    type: routeType,
    args: {
        input: {
            name: "input",
            type: new GraphQLNonNull(routeInputType)
        }
    },
    ...routeResolver.update
};
