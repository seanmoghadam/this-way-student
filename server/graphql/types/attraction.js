import {GraphQLUpload} from "apollo-upload-server/lib/index";
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
import UserModel from "../../models/user";

//this is the schema for the api


export const attractionType = new GraphQLObjectType({
    name: "Attraction",
    fields: () => ({
        _id: {
            type: GraphQLID
        },
        title: {
            type: GraphQLString,
        },
        description: {
            type: GraphQLString,
        },
        shortDescription: {
            type: GraphQLString,
        },
        lat: {
            type: GraphQLFloat,
        },
        lng: {
            type: GraphQLFloat,
        },
        duration: {
            type: GraphQLInt,
        },
        images: {
            type: GraphQLList(new GraphQLObjectType({
                name: "image",
                fields: () => ({
                    original: {
                        type: GraphQLString
                    },
                    originalAlt: {
                        type: GraphQLString
                    },
                    imageSet: {
                        type: GraphQLList(new GraphQLObjectType({
                            name: "sizes",
                            fields: () => ({
                                srcSet: {
                                    type: GraphQLString
                                },
                                media: {
                                    type: GraphQLString
                                }
                            })
                        }))
                    }
                })
            })),
        },
        audioFiles: {
            type: GraphQLList(GraphQLString),
        },
        createdAt: {
            type: GraphQLString
        },
        ratings: {
            type: GraphQLList(new GraphQLObjectType({
                name: "attractionComment",
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


export const attractionInputType = new GraphQLInputObjectType({
    name: "AttractionInput",
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
        lat: {
            type: GraphQLNonNull(GraphQLFloat),
        },
        lng: {
            type: GraphQLNonNull(GraphQLFloat),
        },
        duration: {
            type: GraphQLNonNull(GraphQLFloat),
        },
        images: {
            type: GraphQLList(GraphQLUpload),
        },
        audioFiles: {
            type: GraphQLList(GraphQLUpload),
        },
        ratings: {
            type: GraphQLString
        },
    })
});
