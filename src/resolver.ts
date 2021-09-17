import { User } from './entity/User';
import { getRepository } from 'typeorm';
import { UserInputError } from 'apollo-server';
import { compare, hash } from 'bcrypt';
import { CustomError } from './errors';
import jwt = require('jsonwebtoken');

export const resolvers = {
  Login: {
    user: (parents, args) => {
      return parents;
    },
    token: () => {
      const token = jwt.sign('verifyied', 'supersecret');
      return token;
    },
  },
  Query: {
    user: async (_: string, { id }) => {
      const repository = getRepository(User);
      const resp = await repository.findOne({ id });
      return resp;
    },
  },
  Mutation: {
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
      }
    },
    login: async (_: string, { email, password }) => {
      const repository = getRepository(User);
      const userData = await repository.findOne({ email });
      if (userData == undefined) {
        throw new CustomError('Email não cadastrado', 400);
      } else {
        const match = await compare(password, userData.password);
        if (match) {
          return userData;
        } else {
          throw new CustomError('Senha incorreta', 400);
        }
      }
    },
  },
};
