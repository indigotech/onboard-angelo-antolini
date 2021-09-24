import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    user(id: Int!): User!
    hello: String!
    users(data: ListInput): Pagination
  }
  type Mutation {
    createUser(data: UserInput!): User!
    login(data: LoginInput!): Login!
  }

  type Login {
    user: User
    token: String
  }

  type User {
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

  input LoginInput {
    email: String
    password: String
  }

  type Pagination {
    list: [User]
    pageBefore: Boolean
    pageAfter: Boolean
    totalUsers: String
  }

  input ListInput {
    quantity: Int
    page: Int
  }
`;
