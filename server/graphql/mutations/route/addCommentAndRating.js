import {GraphQLNonNull, GraphQLString, GraphQLFloat} from "graphql";
import routeResolver from "../../resolvers/route/index";
import { routeType} from "../../types/route";


export default {
    type: routeType,
    args: {
        routeId: {
            name: "routeId",
            type: new GraphQLNonNull(GraphQLString)
        },
        comment: {
            name: "comment",
            type: new GraphQLNonNull(GraphQLString)
        },
        rate: {
            name: "rate",
            type: new GraphQLNonNull(GraphQLFloat)
        },

    },
    ...routeResolver.addCommentAndRatingForRoute
};