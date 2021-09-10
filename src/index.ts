import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server-express';

import { typeDefs } from './schema';
import { resolvers } from './resolver';

const startServer = async () => {
  await createConnection();

  const server = new ApolloServer({ typeDefs, resolvers });

  server.start;
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
};

startServer();
