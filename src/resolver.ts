import { User } from './entity/User';
import { getRepository } from 'typeorm';

export const resolvers = {
  Query: {
    hello: (): string => {
      return 'hello world';
    },
  },
  Mutation: {
    createUser: async (_: string, { $name, $email, $password, $birthDate }) => {
      const user = new User();
      user.name = $name;
      user.email = $email;
      user.password = $password;
      user.birthDate = $birthDate;
      getRepository(User).save(user);
      return true;
    },
  },
};
