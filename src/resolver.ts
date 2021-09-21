import { User } from './entity/User';
import { getRepository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { CustomError } from './errors';
import { UserInput } from './schema-types';
import { sign, verify } from 'jsonwebtoken';

export const resolvers = {
  Query: {
    hello: (): string => {
      return 'hello world';
    },
  },
  Mutation: {
    createUser: async (_: string, { data: args }: { data: UserInput }) => {
      const repository = getRepository(User);
      const payload = verify(token, 'supersecret');
      if (payload === 'verifyied') {
        const user = new User();

        user.name = args.name;
        user.email = args.email;
        user.birthDate = args.birthDate;

        let validPassword = true;
        let validEmail = true;

        const sameEmail = await repository.find({ email: user.email });

        if (args.password.length < 7) {
          validPassword = false;
        } else if (args.password.search(/[0-9]/) == -1) {
          validPassword = false;
        } else if (args.password.search(/[a-z]/) == -1 && args.password.search(/[A-Z]/) == -1) {
          validPassword = false;
        } else if (sameEmail.length !== 0) {
          validEmail = false;
        }

        if (validPassword && validEmail) {
          const saltRounds = 0;
          const hashPassword = await hash(args.password, saltRounds);

          user.password = hashPassword;
          const response = await repository.save(user);

          return response;
        } else if (!validEmail) {
          throw new CustomError(
            'Esse e-mail já está cadastrado',
            400,
            'you can`t have more then one user in the database with the same email',
          );
        } else if (!validPassword) {
          throw new CustomError('Senha inválida', 400, 'the password doesn`t have de minimum requirements');
        }
      } else {
        throw new CustomError('Seu login expirou, faça novamente', 401, 'invalid or inexisting token');
      }
    },
    login: async (_: string, { email, password }) => {
      const repository = getRepository(User);
      const userData = await repository.findOne({ email });
      if (!userData) {
        throw new CustomError('Email não cadastrado', 404);
      }
      const match = await compare(password, userData.password);
      const token = sign('verifyied', 'supersecret');
      if (match) {
        return { user: userData, token: token };
      } else {
        throw new CustomError('Senha incorreta', 401);
      }
    },
  },
};
