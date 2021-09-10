import { User } from './entity/User';
import { getConnection } from 'typeorm';

export const resolvers = {
  Query: {
    hello: (): string => {
      return 'hello world';
    },
  },
  Mutation: {
    createUser: async (_: string, { name, email, password, birthDate }) => {
      const user = new User();
      user.name = `Angelo`;
      user.email = `angelo.antolini@taqtile.com.br`;
      user.password = `lalala`;
      user.birthDate = `05/12/1999`;
      return getConnection().manager.save(user);
    },
  },
};
