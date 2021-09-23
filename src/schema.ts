import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    hello: String!
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
`;
