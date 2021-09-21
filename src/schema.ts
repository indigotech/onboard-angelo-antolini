import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    hello: String!
  }
  type Mutation {
    createUser(data: UserInput): outputUser!
  }

  type outputUser {
    name: String!
    email: String!
    birthDate: String!
    id: Int!
  }

  input UserInput {
    name: String
    email: String
    password: String
    birthDate: String
  }
`;
