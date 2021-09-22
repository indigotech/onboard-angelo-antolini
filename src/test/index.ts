import * as dotenv from 'dotenv';
import { startServer } from '../setup';
import { queryRequest } from './individual-tests/query-test';
import supertest = require('supertest');
import { expect } from 'chai';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';
import { UserInput } from '../schema-types';

before(async () => {
  dotenv.config({ path: `${__dirname}/../../test.env` });
  await startServer();
});

afterEach(async () => {
  const repository = getRepository(User);
  await repository.clear();
  const clear = await repository.count();
  expect(clear).to.equal(0);
});

describe('Query test', function () {
  it('should query Hello', async () => {
    const query = await queryRequest(`query { hello }`);
    expect(query.body.data.hello).to.equal('hello world');
  });
});

const userCreation = (query, variables) => {
  return supertest(`http://localhost:${process.env.PORT}`).post('/').send({
    query,
    variables,
  });
};

const mutation = `
    mutation CreateUser($data: UserInput!) {
      createUser(data: $data) {
        id
        name
        email
        birthDate
      }
    }
  `;

describe('User creation test', function () {
  it('should send an input, check the response and check if the user was creatred in the database', async () => {
    const data: UserInput = {
      name: 'test_name',
      email: 'test_name@email.com',
      password: 'senhaok1',
      birthDate: '05/12/1999',
    };
    const send = await userCreation(mutation, { data });

    expect(send.statusCode).to.equal(200);

    const user = send.body.data.createUser;

    expect(user.name).to.equal('test_name');
    expect(user.email).to.equal('test_name@email.com');
    expect(user.birthDate).to.equal('05/12/1999');
    expect(user.id).to.exist;

    const repository = getRepository(User);
    const test = await repository.findOne({ id: user.id });

    expect(test.name).to.equal('test_name');
    expect(test.email).to.equal('test_name@email.com');
    expect(test.birthDate).to.equal('05/12/1999');
    expect(test.id).to.exist;
  });
});

describe('password error test', function () {
  it('should return a password error', async () => {
    let data = {
      name: 'test_name',
      email: 'test_name@email.com',
      password: 'senha1',
      birthDate: '05/12/1999',
    };

    const shortPassword = await userCreation(mutation, { data });
    const passwordError = shortPassword.body.errors[0];
    expect(passwordError.message).to.equal('Senha inválida');
    expect(passwordError.code).to.equal(400);

    data = {
      name: 'test_name',
      email: 'test_name@email.com',
      password: 'senhanotok',
      birthDate: '05/12/1999',
    };

    const noNumberPassword = await userCreation(mutation, { data });
    const passwordError2 = noNumberPassword.body.errors[0];
    expect(passwordError2.message).to.equal('Senha inválida');
    expect(passwordError2.code).to.equal(400);

    data = {
      name: 'test_name',
      email: 'test_name@email.com',
      password: '12345678',
      birthDate: '05/12/1999',
    };

    const noLetterPassword = await userCreation(mutation, { data });

    const passwordError3 = noLetterPassword.body.errors[0];
    expect(passwordError3.message).to.equal('Senha inválida');
    expect(passwordError3.code).to.equal(400);
  });
});
describe('email error test', function () {
  it('should return an email error ', async () => {
    const repository = getRepository(User);
    const user = new User();
    user.name = 'test_name';
    user.email = 'test_name@email.com';
    user.password = 'senhaok1';
    user.birthDate = '05/12/1999';
    repository.save(user);

    const data: UserInput = {
      name: 'test_name2',
      email: user.email,
      password: 'senhaok2',
      birthDate: '06/12/1999',
    };

    const secondUser = await userCreation(mutation, { data });
    const emailError = secondUser.body.errors[0];
    expect(emailError.message).to.equal('Esse e-mail já está cadastrado');
    expect(emailError.code).to.equal(400);
  });
});
