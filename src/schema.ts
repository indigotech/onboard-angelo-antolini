// Construct a schema, using GraphQL schema language
import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Mutation {
    createUser(input: inputUser): outputUser!
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
