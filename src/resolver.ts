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
      const repository = getRepository(User);

      const user = new User();
      user.name = Name;
      user.email = Email;
      user.password = Password;
      user.birthDate = BirthDate;

      let validPasswordLength = true;
      let validPasswordLetter = true;
      let validPasswordNumber = true;
      let validEmail = true;

      user.password.length < 7 ? (validPasswordLength = false) : validPasswordLength;
      user.password.search(/[0-9]/) == -1 ? (validPasswordNumber = false) : validPasswordNumber;
      user.password.search(/[a-z]/) == -1 && user.password.search(/[A-Z]/) == -1
        ? (validPasswordLetter = false)
        : validPasswordLetter;

      const sameEmail = await repository.find({ email: user.email });
      sameEmail.length == 0 ? validEmail : (validEmail = false);

      if (validEmail && validPasswordLength && validPasswordLetter && validPasswordNumber) {
        const response = await repository.save(user);

        const outputUser = {
          Name,
          Email,
          BirthDate,
          Id: response.id,
        };

        return outputUser;
      } else {
        const failUser = {
          Name: 'Invalid User',
        };
        return failUser;
      }
    },
  },
};
