import {GraphQLNonNull, GraphQLString,GraphQLFloat} from "graphql";
import attractionResolver from "../../resolvers/attraction/index";
import { attractionType} from "../../types/attraction";


export default {
    type: attractionType,
    args: {
        attractionId: {
            name: "attractionId",
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
    ...attractionResolver.addCommentAndRatingForAttraction
};