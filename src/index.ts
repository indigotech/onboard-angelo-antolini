import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server';

import { typeDefs } from './schema';
import { resolvers } from './resolver';
import { url } from 'inspector';

const startServer = async () => {
  await createConnection().catch((error) => console.log(error));
  console.log('connection with database OK');

  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await server.listen();
  console.log(`Server running on: ${url}`);
};

startServer();
