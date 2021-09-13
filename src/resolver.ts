import { User } from './entity/User';
import { getRepository } from 'typeorm';

export const resolvers = {
  Query: {
    hello: (): string => {
      return 'hello world';
    },
  },
  Mutation: {
    createUser: async (_: string, { Name, Email, Password, BirthDate }) => {
      const user = new User();
      user.name = Name;
      user.email = Email;
      user.password = Password;
      user.birthDate = BirthDate;

      const outputUser = {
        Name,
        Email,
        BirthDate,
        id: user.id,
      };

      await getRepository(User).save(user);

      return outputUser;
    },
  },
};
