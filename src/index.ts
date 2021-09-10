import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server';

import { typeDefs } from './schema';
import { resolvers } from './resolver';

const startServer = async () => {
  await createConnection();

  const server = new ApolloServer({ typeDefs, resolvers });
  server.listen().then(({ url }) => {
    console.log(`Server running on ${url}`);
  });
};

startServer();
