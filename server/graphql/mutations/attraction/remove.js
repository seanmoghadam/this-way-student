import {GraphQLID, GraphQLNonNull} from "graphql";
import attractionResolver from "../../resolvers/attraction/index";
import {attractionType} from "../../types/attraction";


export default {
    type: attractionType,
    args: {
        id: {
            name: "id",
            type: new GraphQLNonNull(GraphQLID)
        }
    },
    ...attractionResolver.remove
};
