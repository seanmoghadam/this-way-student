import {GraphQLID, GraphQLNonNull} from "graphql";
import userResolver from "../../resolvers/user/index";
import {userType} from "../../types/user";

export default {
    type: userType,
    args: {
        id: {
            name: "id",
            type: new GraphQLNonNull(GraphQLID)
        }
    },
    ...userResolver.remove
};
