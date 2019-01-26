import {GraphQLNonNull, GraphQLString} from "graphql";
import attractionResolver from "../../resolvers/attraction/index";
import {attractionType} from "../../types/attraction";


//add resolver from resolvers to obj
export default {
    type: attractionType,
    args: {
        id: {
            name: "Id",
            type: new GraphQLNonNull(GraphQLString)
        },
    },
    ...attractionResolver.getSingle
};
