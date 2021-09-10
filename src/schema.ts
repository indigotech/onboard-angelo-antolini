// Construct a schema, using GraphQL schema language
import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Mutation {
    addUser(name: String!, email: String!, password: String!, birthDate: String!): boolean!
  }

  type inputUser {
    name: String!
    email: String!
    password: String!
    birthDate: String!
  }

  type outputUser {
    id: Number!
    name: String!
    email: String!
    birthDate: String!
  }
`;
