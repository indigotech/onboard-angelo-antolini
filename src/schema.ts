import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    user(id: Int!): OutputUser!
    users(quantity: Int, page: Int): Pagination
  }
  type Mutation {
    createUser(name: String!, email: String!, password: String!, birthDate: String!, token: String!): OutputUser!
    login(email: String!, password: String!): Login
  }

  type Login {
    user: OutputUser
    token: String
  }

  type OutputUser {
    name: String!
    email: String!
    birthDate: String!
    id: Int!
  }

  type Pagination {
    list: [OutputUser]
    pageBefore: Boolean
    pageAfter: Boolean
    shown: String
  }
`;
