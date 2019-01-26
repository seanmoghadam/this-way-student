import {GraphQLNonNull, GraphQLString} from "graphql";
import userResolver from "../../resolvers/user/index";
import {userType} from "../../types/user";

export default {
    type: userType,
    args: {
        email: {
            name: "Email",
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    ...userResolver.checkIfEmailExists
};