//these are the mutations to edit the data


import gql from "graphql-tag";


export const AddUserMutation = gql`
    mutation addUserMutation($input: UserInput!){
        addUser(input: $input){
            forename
            surname
            email
        }
    }`;
export const EditUserMutation = gql`
    mutation updateUser($input: UserInput!) {
        updateUser(input: $input) {
            forename
            surname
            email
        }
    }
`;

export const RemoveUserMutation = gql`
    mutation removeUser($id: ID!){
        removeUser(id: $id){
            _id
        }
    }`;