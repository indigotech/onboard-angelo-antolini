import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    hello: String!
  }
  type Mutation {
    createUser(name: String!, email: String!, password: String!, birthDate: String!): outputUser!
  }

  type inputUser {
    name: String!
    email: String!
    password: String!
    birthDate: String!
  }

  type outputUser {
    id: Int!
    name: String!
    email: String!
    birthDate: String!
  }
`;
