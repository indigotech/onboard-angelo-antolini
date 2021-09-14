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

      let validInput = true;
      const sameEmail = await repository.find({ email: user.email });

      if (user.password.length < 7) {
        validInput = false;
      } else if (user.password.search(/[0-9]/) == -1) {
        validInput = false;
      } else if (user.password.search(/[a-z]/) == -1 && user.password.search(/[A-Z]/) == -1) {
        validInput = false;
      } else if (sameEmail.length !== 0) {
        validInput = false;
      }

      if (validInput) {
        const response = await repository.save(user);

        const outputUser = {
          Name,
          Email,
          BirthDate,
          Id: response.id,
        };

        return outputUser;
      } else {
        console.error('Usuário Inválido');
      }
    },
  },
};
