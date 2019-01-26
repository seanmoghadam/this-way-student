import {GraphQLID, GraphQLNonNull} from "graphql";
import routeResolver from "../../resolvers/route/index";
import {routeType} from "../../types/route";

export default {
    type: routeType,
    args: {
        id: {
            name: "id",
            type: new GraphQLNonNull(GraphQLID)
        }
    },
    ...routeResolver.remove
};
