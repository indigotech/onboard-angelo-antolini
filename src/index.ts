import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server';

import { typeDefs } from './schema';
import { resolvers } from './resolver';

const startServer = async () => {
  await createConnection().catch((error) => console.log(error));
  console.log('connection with database OK');

  const server = new ApolloServer({ typeDefs, resolvers });
  server
    .listen()
    .then(({ url }) => {
      console.log(`Server running on ${url}`);
    })
    .catch((error) => console.log(error));
};

startServer();
