import {GraphQLNonNull, GraphQLString} from "graphql";
import routeResolver from "../../resolvers/route/index";
import {routeType} from "../../types/route";


//add resolver from resolvers to obj
export default {
    type: routeType,
    args: {
        id: {
            name: "Id",
            type: new GraphQLNonNull(GraphQLString)
        },
    },
    ...routeResolver.getSingle
};
