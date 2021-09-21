import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    hello: String!
  }
  type Mutation {
    createUser(name: String!, email: String!, password: String!, birthDate: String!): outputUser!
  }

  type outputUser {
    name: String!
    email: String!
    birthDate: String!
    id: Int!
  }

  type UserInput {
    name: String
    email: String
    password: String
    birthDate: String
  }
`;
