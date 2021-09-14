import { User } from './entity/User';
import { getRepository } from 'typeorm';
import { UserInputError, ApolloError } from 'apollo-server';

export const resolvers = {
  Query: {
    hello: (): string => {
      return 'hello world';
    },
  },
  Mutation: {
    createUser: async (_: string, { name, email, password, birthDate }) => {
      const repository = getRepository(User);

      const user = new User();
      user.name = name;
      user.email = email;
      user.password = password;
      user.birthDate = birthDate;

      let validPassword = true;
      let validEmail = true;
      const sameEmail = await repository.find({ email: user.email });

      if (user.password.length < 7) {
        validPassword = false;
      } else if (user.password.search(/[0-9]/) == -1) {
        validPassword = false;
      } else if (user.password.search(/[a-z]/) == -1 && user.password.search(/[A-Z]/) == -1) {
        validPassword = false;
      } else if (sameEmail.length !== 0) {
        validEmail = false;
      }

      if (validPassword && validEmail) {
        const response = await repository.save(user);

        return response;
      } else if (validEmail == false) {
        throw new UserInputError('Já existe um usuário com este e-mail');
      } else if (validPassword == false) {
        throw new UserInputError('Senha inválida');
      }
    },
  },
};
