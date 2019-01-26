import {
    GraphQLFloat,
    GraphQLID,
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString
} from "graphql";
import AttractionModel from "../../models/attraction";
import UserModel from "../../models/user";
import {attractionType} from "./attraction";

//this is the schema for the api


export const routeType = new GraphQLObjectType({
    name: "Route",
    fields: () => ({
        _id: {
            type: GraphQLID,
        },
        title: {
            type: GraphQLString,
        },
        createdAt: {
            type: GraphQLString,
        },
        description: {
            type: GraphQLString,
        },
        shortDescription: {
            type: GraphQLString,
        },
        attractions: {
            type: new GraphQLList(attractionType),
            resolve(input) {
                return new Promise(resolve => {
                    AttractionModel.find({"_id": {$in: [...input.attractions]}}).exec().then((attractions) => {
                        resolve(input.attractions.map(ID => attractions.find(attraction => attraction.id === ID)));
                    });
                });
            }
        },
        duration: {
            type: GraphQLInt,
        },
        distance: {
            type: GraphQLInt,
        },
        endPoint: {
            type: GraphQLString,
        },
        startPoint: {
            type: GraphQLString,
        },
        ratings: {
            type: GraphQLList(new GraphQLObjectType({
                name: "routeComment",
                fields: () => ({
                    created_at: {
                        type: GraphQLString
                    },
                    comment: {
                        type: GraphQLString
                    },
                    userName: {
                        type: GraphQLString,
                        resolve(input) {
                            if (input.userId) {
                                return new Promise(resolve => {
                                    UserModel.findOne({"_id": input.userId}).exec().then((user) => {
                                        if (user) {
                                            return resolve(user.forename);
                                        }
                                        else {
                                            return resolve("User");
                                        }
                                    });
                                });
                            } else return "User";
                        }
                    },
                    userId: {
                        type: GraphQLString,
                    },
                    rating: {
                        type: GraphQLFloat
                    },
                })
            })),
        },
    })
});


export const routeInputType = new GraphQLInputObjectType({
    name: "RouteInput",
    fields: () => ({
        id: {
            type: GraphQLID
        },
        title: {
            type: GraphQLNonNull(GraphQLString),
        },
        description: {
            type: GraphQLNonNull(GraphQLString),
        },
        shortDescription: {
            type: GraphQLNonNull(GraphQLString),
        },
        attractions: {
            type: GraphQLList(GraphQLString),
        },
        duration: {
            type: GraphQLNonNull(GraphQLInt),
        },
        distance: {
            type: GraphQLNonNull(GraphQLInt),
        },
        endPoint: {
            type: GraphQLNonNull(GraphQLString),
        },
        startPoint: {
            type: GraphQLNonNull(GraphQLString),
        },
        ratings: {
            type: GraphQLFloat,
        }

    })
});
