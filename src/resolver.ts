import { User } from './entity/User';

export const resolvers = {
  Query: {
    hello: (): string => {
      return 'hello world';
    },
  },
  Mutation: {
    createUser: async (_: string, { name, email, password, birthDate }) => {
      const user = {
        id: 12,
        name,
        email,
        birthDate,
      };
      return user;
    },
  },
};
