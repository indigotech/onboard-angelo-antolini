import { createMutation, userCreation } from './constants';
import { expect } from 'chai';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';
import { UserInput } from '../schema-types';
import { sign } from 'jsonwebtoken';

export const createUserTest = describe('createUser mutation', function () {
  it('should send an input, check the response and check if the user was creatred in the database', async () => {
    const data: UserInput = {
      name: 'test_name',
      email: 'test_name@email.com',
      password: 'senhaok1',
      birthDate: '05/12/1999',
    };

    const token = sign({ id: 1 }, 'supersecret');
    const send = await userCreation(createMutation, { data }, token);

    expect(send.statusCode).to.equal(200);

    const user = send.body.data.createUser;

    expect(user.name).to.equal('test_name');
    expect(user.email).to.equal('test_name@email.com');
    expect(user.birthDate).to.equal('05/12/1999');
    expect(user.id).to.greaterThan(0);

    const repository = getRepository(User);
    const test = await repository.findOne({ id: user.id });

    expect(test.name).to.equal('test_name');
    expect(test.email).to.equal('test_name@email.com');
    expect(test.birthDate).to.equal('05/12/1999');
    expect(test.id).to.greaterThan(0);
  });

  it('should return a password error', async () => {
    let data = {
      name: 'test_name',
      email: 'test_name@email.com',
      password: 'senha1',
      birthDate: '05/12/1999',
    };

    const token = sign({ id: 1 }, 'supersecret');
    const shortPassword = await userCreation(createMutation, { data }, token);
    const passwordError = shortPassword.body.errors[0];
    expect(passwordError.message).to.equal('Senha inválida');
    expect(passwordError.code).to.equal(400);

    data = {
      name: 'test_name',
      email: 'test_name@email.com',
      password: 'senhanotok',
      birthDate: '05/12/1999',
    };

    const noNumberPassword = await userCreation(createMutation, { data }, token);
    const passwordError2 = noNumberPassword.body.errors[0];
    expect(passwordError2.message).to.equal('Senha inválida');
    expect(passwordError2.code).to.equal(400);

    data = {
      name: 'test_name',
      email: 'test_name@email.com',
      password: '12345678',
      birthDate: '05/12/1999',
    };

    const noLetterPassword = await userCreation(createMutation, { data }, token);

    const passwordError3 = noLetterPassword.body.errors[0];
    expect(passwordError3.message).to.equal('Senha inválida');
    expect(passwordError3.code).to.equal(400);
  });

  it('should return an email error ', async () => {
    const repository = getRepository(User);
    const user = new User();
    user.name = 'test_name';
    user.email = 'test_name@email.com';
    user.password = 'senhaok1';
    user.birthDate = '05/12/1999';
    repository.save(user);

    let data: UserInput = {
      name: 'test_name2',
      email: user.email,
      password: 'senhaok2',
      birthDate: '06/12/1999',
    };

    const token = sign({ id: 1 }, 'supersecret');
    const secondUser = await userCreation(createMutation, { data }, token);
    const emailError = secondUser.body.errors[0];
    expect(emailError.message).to.equal('E-mail já cadastrado');
    expect(emailError.code).to.equal(400);

    data = {
      name: 'test_name',
      email: 'invalidemail',
      password: 'senhaok1',
      birthDate: '05/12/1999',
    };

    const invalidFormat = await userCreation(createMutation, { data }, token);
    const emailFormatError = invalidFormat.body.errors[0];
    expect(emailFormatError.message).to.equal('formato de e-mail inválido');
    expect(emailFormatError.code).to.equal(400);
  });
});
