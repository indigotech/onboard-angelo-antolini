import * as dotenv from 'dotenv';
import { startServer } from '../setup';
import { loginMutation, userCreation } from './constants';
import { expect } from 'chai';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';
import { LonginInput } from '../schema-types';
import { hash } from 'bcrypt';
import { verify } from 'jsonwebtoken';

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

describe('Login test', function () {
  it('Should make the login and check the return and a valid token', async () => {
    const repository = getRepository(User);
    const user = new User();
    user.name = 'test_name';
    user.email = 'test_name@email.com';
    user.password = await hash('senhaok1', 0);
    user.birthDate = '05/12/1999';
    await repository.save(user);

    const data: LonginInput = {
      email: user.email,
      password: 'senhaok1',
    };

    const loginResponse = await userCreation(loginMutation, { data });

    const login = loginResponse.body.data.login;

    expect(login.user.name).to.equal('test_name');
    expect(login.user.email).to.equal('test_name@email.com');
    expect(login.user.birthDate).to.equal('05/12/1999');
    expect(login.user.id).to.equal(user.id);
    const valid = verify(login.token, 'supersecret');
    expect(valid).to.equal(`${user.id}`);
  });

  it('should return an email login error', async () => {
    const repository = getRepository(User);
    const user = new User();
    user.name = 'test_name';
    user.email = 'test_name@email.com';
    user.password = await hash('senhaok1', 0);
    user.birthDate = '05/12/1999';
    await repository.save(user);

    const data: LonginInput = {
      email: 'wrong_test_name@email.com',
      password: 'senhaok1',
    };
    const inexistingEmail = await userCreation(loginMutation, { data });

    const emailError = inexistingEmail.body.errors[0];
    expect(emailError.message).to.equal('Email não cadastrado');
    expect(emailError.code).to.equal(404);
  });

  it('should return a password login error', async () => {
    const repository = getRepository(User);
    const user = new User();
    user.name = 'test_name';
    user.email = 'test_name@email.com';
    user.password = await hash('senhaok1', 0);
    user.birthDate = '05/12/1999';
    await repository.save(user);

    const data: LonginInput = {
      email: user.email,
      password: 'senhanotok1',
    };
    const wrongPassword = await userCreation(loginMutation, { data });
    const passwordError = wrongPassword.body.errors[0];
    expect(passwordError.message).to.equal('Senha incorreta');
    expect(passwordError.code).to.equal(401);
  });
});
