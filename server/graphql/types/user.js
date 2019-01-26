import {GraphQLID, GraphQLInputObjectType, GraphQLList, GraphQLObjectType, GraphQLString,} from "graphql";

import RouteModel from "../../models/route";
import {routeType} from "./route";

//this is the schema for the api


export const userType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        _id: {
            type: GraphQLID,
        },
        email: {
            type: GraphQLString,
        },
        forename: {
            type: GraphQLString,
        },
        surname: {
            type: GraphQLString,
        },
        password: {
            type: GraphQLString,
        },
        routes: {
            type: new GraphQLList(routeType),
            resolve(user) {
                const {_id} = user;
                return RouteModel.find({uid: _id}).exec();
            }
        },
        token: {
            type: GraphQLString,
        },
        createdAt: {
            type: GraphQLString,
        },
        updatedAt: {
            type: GraphQLString,
        }

    })
});


export const userInputType = new GraphQLInputObjectType({
    name: "UserInput",
    fields: () => ({
        id: {
            type: GraphQLString,
        },
        email: {
            type: GraphQLString,
        },
        forename: {
            type: GraphQLString,
        },
        surname: {
            type: GraphQLString,
        },
        passwordOne: {
            type: GraphQLString,
        },
        passwordTwo: {
            type: GraphQLString,
        },
        token: {
            type: GraphQLString,
        }
    })
});
