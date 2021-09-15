import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server';

import { typeDefs } from './schema';
import { resolvers } from './resolver';

export const startServer = async () => {
  await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: ['src/entity/**/*.ts'],
  });

  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await server.listen({ port: process.env.PORT });
  console.log(`Server running on: ${url}`);
};
