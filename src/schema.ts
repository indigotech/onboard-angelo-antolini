import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    hello: String!
  }
  type Mutation {
    createUser(name: String!, email: String!, password: String!, birthDate: String!): outputUser!
    login(email: String!, password: String): outputUser!
  }

  type login {
    user(email: String!, password: String!): outputUser
    token(validation: Boolean!): String
  }

  type outputUser {
    name: String!
    email: String!
    birthDate: String!
    id: Int!
  }
`;
