import { User } from './entity/User';
import { getRepository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { CustomError } from './errors';
import { ListInput, LonginInput, UserInput } from './schema-types';
import { sign, verify } from 'jsonwebtoken';

function verifyToken(context) {
  if (!context.token) {
    throw new CustomError('Voce nao tem permissao para efetuar essa açao', 401, 'token not found');
  }

  if (!verify(context.token, 'supersecret')) {
    throw new CustomError('Ação nao autorizada', 401);
  }
}

export const resolvers = {
  Query: {
    user: async (_, { id }, context) => {
      verifyToken(context);

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

    users: async (_: string, { data: args }: { data: ListInput }, context) => {
      verifyToken(context);

      let pageBefore = false;
      let pageAfter = false;
      let quantity = args.quantity;
      let page = args.page;

      const repository = getRepository(User);

      if (page === 0) {
        throw new CustomError('Esta página não existe', 404);
      }
      if (quantity === 0) {
        throw new CustomError('Quantidade inválida de usuários', 400);
      }

      if (!quantity) {
        quantity = 10;
      }
      if (!page) {
        page = 0;
      } else {
        page += -1;
      }
      const skip = page * quantity;

      const list = await repository.createQueryBuilder().orderBy('name').limit(args.quantity).offset(skip).getMany();

      const totalUsers = await repository.count();
      const pastUsers = (page + 1) * quantity;
      const totalPages = Math.round(totalUsers / quantity);

      if (page > totalPages) {
        throw new CustomError('Esta página não existe', 404, 'page not found');
      }

      if (page > 0) {
        pageBefore = true;
      }
      if (pastUsers < totalUsers) {
        pageAfter = true;
      }

      return { list: list, pageBefore: pageBefore, pageAfter: pageAfter, totalUsers: totalUsers };
    },
  },
  Mutation: {
    createUser: async (_, { data: args }: { data: UserInput }, context) => {
      verifyToken(context);

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
      const userData = await repository.findOne({ email: args.email });

      if (!userData) {
        throw new CustomError('Email não cadastrado', 404);
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
