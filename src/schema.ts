import { gql } from 'apollo-server';

export const typeDefs = gql`
    type Mutation {
        createUser(input: UserInput): User
    }

    type UserInput{
        name: string;
        email: string;
        password: string;
        birthdate: string
    }

    type User{
        id:number;
        name: string;
        email: string;
        birthdate: string
    }

    `;
