import gql from "graphql-tag";
//these are the mutations to read the data


export const AllUsersQuery = gql`
    query users{
        Users{
            email forename surname _id
        }
    }
`;

export const CheckIfEmailExistsQuery = gql`
    query checkIfEmailExists($input: String!){
        CheckIfEmailExists(email: $input){
            email
        }
    }
`;

export const LoginQuery = gql`
    query login($email: String!, $password: String!){
        Login(email: $email, password: $password){
            forename
            email
            token
        }
    }
`;

export const getLoggedInUser = gql`
    query userById($input: String!){
        UserById(id: $input){
            forename
            surname
            createdAt
            updatedAt
            email
        }
    }
`;