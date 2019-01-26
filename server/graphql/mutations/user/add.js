import {GraphQLNonNull} from "graphql";
import userResolver from "../../resolvers/user/index";
import {userInputType, userType} from "../../types/user";


export default {
    type: userType,
    args: {
        input: {
            name: "input",
            type: new GraphQLNonNull(userInputType)
        }
    },
    ...userResolver.signUp
};
