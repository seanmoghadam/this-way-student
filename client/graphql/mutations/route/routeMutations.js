//these are the mutations to edit the data


import gql from "graphql-tag";

export const AddRouteMutation = gql`
    mutation addRoute($input: RouteInput!){
        addRoute(input: $input){
            title
            _id
            duration
            distance
            attractions {
                title
                _id
                images {original originalAlt }
                shortDescription
            }
        }
    }`;

export const UpdateRouteMutation = gql`
    mutation updateRoute($input: RouteInput!){
        updateRoute(input: $input){
            title
            _id
            duration
            distance
            attractions {
                title
                _id
                images {original originalAlt }
                shortDescription
            }
        }
    }`;

export const RemoveRouteMutation = gql`
    mutation removeRoute($id: ID!){
        removeRoute(id: $id){
            _id
        }
    }`;

export const addCommentMutation = gql`
    mutation addCommentAndRating($routeId: String!, $comment: String!, $rating : Float!){
        addCommentAndRatingForRoute(routeId: $routeId, comment: $comment, rate: $rating){
            ratings {
                userId
                rating
                comment
                created_at
                userName
            }
        }
    }`;