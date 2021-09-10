import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server';
import { User } from './entity/User';

import { typeDefs } from './schema';
import { resolvers } from './resolver';

const startServer = async () => {
  await createConnection({
    name: 'default',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'angeloantolini',
    password: 'Skimboard159753',
    database: 'First-docker',
  });

  const server = new ApolloServer({ typeDefs, resolvers });
  server.listen().then(({ url }) => {
    console.log(`Server running on ${url}`);
  });
};

startServer();
