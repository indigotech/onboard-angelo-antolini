import { User } from './entity/User';

export const resolvers = {
  Mutation: {
    addUser: async (_, { name, email, password, birthDate }) => {
      const storeUser = {
        id: 12,
        name,
        email,
        password,
        birthDate,
      };

      User.create(storeUser);
      return true;
    },
  },
};
