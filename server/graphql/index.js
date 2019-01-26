import {GraphQLObjectType, GraphQLSchema} from "graphql";
//graphql schema for server
//thats the place where all the other folder come together for schema creation
//will be importet in server/index.js
import mutations from "./mutations";
import queries from "./queries";

export default new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "Query",
        fields: queries
    }),
    mutation: new GraphQLObjectType({
        name: "Mutation",
        fields: mutations
    })
});
