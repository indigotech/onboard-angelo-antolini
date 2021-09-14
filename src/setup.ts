import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server';

import { typeDefs } from './schema';
import { resolvers } from './resolver';

export const startServer = async () => {
  console.log('ol]=', process.env.DATABASE_URL);
  await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: ['src/entity/**/*.ts'],
  });
  console.log('connection with database OK');

  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await server.listen();
  console.log(`Server running on: ${url}`);
};
