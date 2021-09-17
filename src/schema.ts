import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    hello: String!
  }
  type Mutation {
<<<<<<< HEAD
<<<<<<< HEAD
    createUser(data: UserInput): outputUser!
=======
    createUser(name: String!, email: String!, password: String!, birthDate: String!): outputUser!
=======
    createUser(name: String!, email: String!, password: String!, birthDate: String!, token: String!): outputUser!
>>>>>>> 1c9fbf1... userCreation com token
    login(email: String!, password: String!): Login
  }

<<<<<<< HEAD
  type login {
    user(email: String!, password: String!): outputUser
    token(validation: Boolean!): String
>>>>>>> c4a35ea... inicio do login
=======
  type Login {
    user: outputUser
    token: String
>>>>>>> 0d473c0... integration with database
  }

  type outputUser {
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
`;
