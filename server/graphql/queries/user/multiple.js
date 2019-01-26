import {GraphQLList} from "graphql";
import userResolver from "../../resolvers/user/index";
import {userType} from "../../types/user";


export default {
    type: new GraphQLList(userType),
    ...userResolver.multiple
};
