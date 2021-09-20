import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    user(id: Int!): OutputUser!
    users(quantity: Int): [OutputUser]
  }
  type Mutation {
    createUser(name: String!, email: String!, password: String!, birthDate: String!, token: String!): OutputUser!
    login(email: String!, password: String!): Login
  }

  type Login {
    user: OutputUser
    token: String
<<<<<<< HEAD
=======
    createUser(name: String!, email: String!, password: String!, birthDate: String!, token: String!): OutputUser!
    login(email: String!, password: String): OutputUser!
  }

  type Login {
    user: OutputUser
    token: String
>>>>>>> f0ec873... criando a query
  }

  type OutputUser {
    name: String!
    email: String!
    birthDate: String!
    id: Int!
  }
`;
