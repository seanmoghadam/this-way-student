//these are the mutations to read the data


import gql from "graphql-tag";

export const AttractionsQueryLimited = gql`
    query getAllAttractions{
        Attractions{
            title
            createdAt
            _id
            duration
            images {original originalAlt imageSet {srcSet media}}
            shortDescription
        }
    }`;

export const AttractionsQuery = gql`
    query getAllAttractions{
        Attractions{
            audioFiles
            title
            createdAt
            _id
            duration
            images {original originalAlt imageSet {srcSet media}}
            shortDescription
            lat
            lng
        }
    }`;

export const Attraction = gql`
    query singleAttraction($id : String!){
        SingleAttraction(id: $id){
            audioFiles
            images {
                imageSet {
                    srcSet
                    media
                }
                originalAlt
                original
            }
            lat
            lng
            description
            title
            duration
            shortDescription
            ratings {
                userId
                rating
                comment
                created_at
                userName
            }
        }
    }`;