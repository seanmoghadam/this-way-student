import {GraphQLNonNull} from "graphql";
import attractionResolver from "../../resolvers/attraction/index";
import {attractionInputType, attractionType} from "../../types/attraction";


export default {
    type: attractionType,
    args: {
        input: {
            name: "input",
            type: new GraphQLNonNull(attractionInputType)
        }
    },
    ...attractionResolver.add
};