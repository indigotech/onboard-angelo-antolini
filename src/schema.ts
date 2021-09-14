import { gql, ApolloError } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    hello: String!
  }
  type Mutation {
    createUser(Name: String!, Email: String!, Password: String!, BirthDate: String!): outputUser!
  }

  type outputUser {
    Name: String!
    Email: String!
    BirthDate: String!
    Id: Int!
  }
`;
