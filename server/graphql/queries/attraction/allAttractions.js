import {GraphQLList} from "graphql";
import attractionResolver from "../../resolvers/attraction/index";
import {attractionType} from "../../types/attraction";


export default {
    type: new GraphQLList(attractionType),
    ...attractionResolver.getMultiple
};
