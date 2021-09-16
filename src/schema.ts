import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    hello: String!
  }
  type Mutation {
    createUser(name: String!, email: String!, password: String!, birthDate: String!, token: String!): outputUser!
    login(email: String!, password: String!): Login
  }

  type Login {
    user: outputUser
    token: String
    createUser(name: String!, email: String!, password: String!, birthDate: String!, token: String!): outputUser!
    login(email: String!, password: String): outputUser!
  }

  type Login {
    user: outputUser
    token: String
  }

  type outputUser {
    name: String!
    email: String!
    birthDate: String!
    id: Int!
  }
`;
