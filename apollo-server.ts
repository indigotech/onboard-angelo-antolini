import { gql, ApolloServer } from 'apollo-server';

//Types
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

//Resolvers
const resolvers = {
  Query: {
    hello: () => {
      return 'Hello World!';
    },
  },
};

//Server
const app = new ApolloServer({ typeDefs, resolvers });
app.listen().then(({ url }) => console.log(`Server url: ${url}`));
