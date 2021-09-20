import { User } from './entity/User';
import { getRepository } from 'typeorm';
<<<<<<< HEAD
=======
import { UserInputError } from 'apollo-server';
>>>>>>> 6b1acd3... autenticacao
import { compare, hash } from 'bcrypt';
import { CustomError } from './errors';
import { LonginInput, UserInput } from './schema-types';
import { sign, verify } from 'jsonwebtoken';

export const resolvers = {
  Query: {
    user: async (_, { id }) => {
      const repository = getRepository(User);
      const resp = await repository.findOne({ id });

      if (!resp) {
        throw new CustomError('Usuário não encontrado', 404);
      }
      return resp;
    },

    hello: (): string => {
      return 'hello world';
    },

    users: async (_: string, quantity?: number) => {
      const repository = getRepository(User);
      const list = await repository.createQueryBuilder().orderBy('name').limit(10).getMany();
      return list;
    },
  },
  Mutation: {
<<<<<<< HEAD
    createUser: async (_, { data: args }: { data: UserInput }, context) => {
      if (!context.token) {
        throw new CustomError('Voce nao tem permissao para efetuar essa açao', 404, 'token not found');
      }

      const valid = verify(context.token, 'supersecret');
      if (!valid) {
        throw new CustomError('Ação nao autorizada', 401);
=======
    createUser: async (_: string, { name, email, password, birthDate, token }) => {
      const payload = jwt.verify(token, 'supersecret');
      if (payload == 'verifyied') {
        const repository = getRepository(User);

        const user = new User();

        user.name = name;
        user.email = email;
        user.birthDate = birthDate;

        let validPassword = true;
        let validEmail = true;

        const sameEmail = await repository.find({ email: user.email });
        const originalPassword = password;

        if (originalPassword.length < 7) {
          validPassword = false;
        } else if (originalPassword.search(/[0-9]/) == -1) {
          validPassword = false;
        } else if (originalPassword.search(/[a-z]/) == -1 && originalPassword.search(/[A-Z]/) == -1) {
          validPassword = false;
        } else if (sameEmail.length !== 0) {
          validEmail = false;
        }

        if (validPassword && validEmail) {
          const saltRounds = 0;
          const hashPassword = await hash(originalPassword, saltRounds);

          user.password = hashPassword;
          const response = await repository.save(user);

          return response;
        } else if (validEmail == false) {
          throw new CustomError(
            'Esse e-mail já está cadastrado',
            400,
            'you can`t have more then one user in the database with the same email',
          );
        } else if (validPassword == false) {
          throw new CustomError('Senha inválida', 400, 'the password doesn`t have de minimum requirements');
        }
      } else {
        throw new CustomError('Seu login expirou, faça novamente', 401, 'invalid or inexisting token');
>>>>>>> 6b1acd3... autenticacao
      }

      const repository = getRepository(User);
      const user = new User();

      user.name = args.name;
      user.email = args.email;
      user.birthDate = args.birthDate;

      let validPassword = true;
      let newEmail = true;
      let validEmail = true;

      const sameEmail = await repository.find({ email: user.email });

      if (args.password.length < 7) {
        validPassword = false;
      } else if (args.password.search(/[0-9]/) == -1) {
        validPassword = false;
      } else if (args.password.search(/[a-z]/) == -1 && args.password.search(/[A-Z]/) == -1) {
        validPassword = false;
      } else if (sameEmail.length !== 0) {
        newEmail = false;
      }

      const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!user.email.match(regexEmail)) {
        validEmail = false;
      }

      if (!newEmail) {
        throw new CustomError(
          'E-mail já cadastrado',
          400,
          'you can`t have more then one user in the database with the same email',
        );
      } else if (!validEmail) {
        throw new CustomError('formato de e-mail inválido', 400);
      } else if (!validPassword) {
        throw new CustomError('Senha inválida', 400, 'the password doesn`t have de minimum requirements');
      }
      const saltRounds = 0;
      const hashPassword = await hash(args.password, saltRounds);

      user.password = hashPassword;
      const response = await repository.save(user);

      return response;
    },

    login: async (_, { data: args }: { data: LonginInput }) => {
      const repository = getRepository(User);
<<<<<<< HEAD
      const userData = await repository.findOne({ email: args.email });

      if (!userData) {
        throw new CustomError('Email não cadastrado', 404);
=======
      const userData = await repository.findOne({ email });
      if (userData == undefined) {
        throw new UserInputError('Email não cadastrado');
      } else if (compare(password, userData.password)) {
        return userData;
      } else {
        throw new UserInputError('Senha incorreta');
>>>>>>> 6b1acd3... autenticacao
      }
      const match = await compare(args.password, userData.password);

      if (!match) {
        throw new CustomError('Senha incorreta', 401);
      }

      const token = sign(`${userData.id}`, 'supersecret');
      return { user: userData, token: token };
    },
  },
};
