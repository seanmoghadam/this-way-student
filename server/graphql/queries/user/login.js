import {GraphQLNonNull, GraphQLString} from "graphql";
import userResolver from "../../resolvers/user/index";
import {userType} from "../../types/user";

//add resolver from resolvers to obj
export default {
    type: userType,
    args: {
        email: {
            name: "Email",
            type: new GraphQLNonNull(GraphQLString)
        },
        password: {
            name: "Password",
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    ...userResolver.login
};
