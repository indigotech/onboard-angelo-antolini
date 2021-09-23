import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    user(id: Int!): User!
    hello: String!
    users(quantity: Int, page: Int): Pagination
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
    adress: Address
  }

  type Address {
    CEP: String
    street: String
    streetNumber: Int
    complement: String
    neighborhood: String
    city: String
    state: String
  }

  input UserInput {
    name: String
    email: String
    password: String
    birthDate: String
    adress: Adress
  }

  input LoginInput {
    email: String
    password: String
  }

  type Pagination {
    list: [User]
    pageBefore: Boolean
    pageAfter: Boolean
    shown: String
  }
`;
