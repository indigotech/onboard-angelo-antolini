import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    user(id: Int!): outputUser!
  }
  type Mutation {
    createUser(data: UserInput!): User!
    login(data: LoginInput!): Login!
  }

  type Login {
    user: User
    token: String
    createUser(name: String!, email: String!, password: String!, birthDate: String!, token: String!): outputUser!
    login(email: String!, password: String): outputUser!
  }

  type Login {
    user: outputUser
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
