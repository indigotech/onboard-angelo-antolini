import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server';

import { typeDefs } from './schema';
import { resolvers } from './resolver';

const startServer = async () => {
  await createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'local',
    entities: [`${__dirname}/entity/*.ts`],
  });

  const server = new ApolloServer({ typeDefs, resolvers });
  server.listen().then(({ url }) => {
    console.log(`Server running on ${url}`);
  });
};

startServer();
