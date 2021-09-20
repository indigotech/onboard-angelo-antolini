import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
<<<<<<< HEAD
    user(id: Int!): User!
    hello: String!
=======
    user(id: Int!): OutputUser!
    users(quantity: Int, page: Int): Pagination
>>>>>>> 07ce693... pagination
  }
  type Mutation {
    createUser(data: UserInput!): User!
    login(data: LoginInput!): Login!
  }

  type Login {
    user: User
    token: String
  }

<<<<<<< HEAD
  type User {
=======
  type OutputUser {
>>>>>>> 07ce693... pagination
    name: String!
    email: String!
    birthDate: String!
    id: Int!
  }

<<<<<<< HEAD
  input UserInput {
    name: String
    email: String
    password: String
    birthDate: String
  }

  input LoginInput {
    email: String
    password: String
=======
  type Pagination {
    list: [OutputUser]
    pageBefore: Boolean
    pageAfter: Boolean
    shown: String
>>>>>>> 07ce693... pagination
  }
`;
