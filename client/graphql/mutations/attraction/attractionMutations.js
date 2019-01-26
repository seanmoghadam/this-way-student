//these are the mutations to edit the data

import gql from "graphql-tag";

export const AddAttractionMutation = gql`
    mutation addAttraction($input: AttractionInput!){
        addAttraction(input: $input){
            title
            createdAt
            _id
            duration
            images {original originalAlt imageSet {srcSet media}}
            shortDescription
        }
    }`;

export const UpdateAttractionMutation = gql`
    mutation updateAttraction($input: AttractionInput!){
        updateAttraction(input: $input){
            title
            createdAt
            _id
            duration
            images {original originalAlt imageSet {srcSet media}}
            shortDescription
        }
    }`;

export const RemoveAttractionMutation = gql`
    mutation removeAttraction($id: ID!){
        removeAttraction(id: $id){
            _id
        }
    }`;

export const addCommentMutation = gql`mutation addCommentAndRating($attractionId: String!, $comment: String!, $rating : Float!){
    addCommentAndRatingForAttraction(attractionId: $attractionId, comment: $comment, rate: $rating){
        ratings {
            userId
            rating
            comment
            created_at
            userName
        }
    }
}`;