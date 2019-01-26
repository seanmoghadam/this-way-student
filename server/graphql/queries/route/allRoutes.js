import {GraphQLList} from "graphql";
import routeResolver from "../../resolvers/route/index";
import {routeType} from "../../types/route";


export default {
    type: new GraphQLList(routeType),
    ...routeResolver.getMultiple
};
