import {GraphQLNonNull, GraphQLString} from "graphql";
import userResolver from "../../resolvers/user/index";
import {userType} from "../../types/user";

export default {
    type: userType,
    args: {
        id: {
            name: "Id",
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    ...userResolver.singleById
};