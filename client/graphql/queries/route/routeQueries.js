//these are the mutations to read the data


import gql from "graphql-tag";

export const RoutesQueryLimited = gql`
    query getAllRoutes{
        Routes{
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

export const RoutesQuery = gql`
    query getAllRoutes{
        Routes{
            title
            createdAt
            _id
            duration
            description
            distance
            startPoint
            endPoint
            shortDescription
            attractions {
                title
                createdAt
                _id
                duration
                images {original originalAlt imageSet {srcSet media}}
                shortDescription
                lat
                lng
            }
        }
    }`;

export const Route = gql`
    query singleRoute($id : String!){
        SingleRoute(id: $id) {
            title
            createdAt
            _id
            duration
            description
            distance
            startPoint
            endPoint
            shortDescription
            attractions {
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
            ratings {
                userId
                rating
                comment
                created_at
                userName
            }
        }
    }`;