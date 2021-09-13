import { User } from './entity/User';
import { getRepository } from 'typeorm';
import { get } from 'http';

export const resolvers = {
  Query: {
    hello: (): string => {
      return 'hello world';
    },
  },
  Mutation: {
    createUser: async (_: string, { $name, $email, $password, $birthDate }) => {
      const user = new User();
      user.id = 1;
      user.name = '$name';
      user.email = 'abobora';
      user.password = 'abobora';
      user.birthDate = 'abobora';
      console.log('user criation OK');

      getRepository(User).save(user);

      console.log(`User saved with the id: ${user.id}`);
      return user;
    },
  },
};
