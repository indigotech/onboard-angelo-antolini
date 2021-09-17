import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server';
import { formatError } from './errors';

import { typeDefs } from './schema';
import { resolvers } from './resolver';

export const startServer = async () => {
  const connection = await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: ['src/entity/**/*.ts'],
    synchronize: true,
  });

  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await server.listen({ port: process.env.PORT }, formatError);
  console.log(`Server running on: ${url}`);
};
