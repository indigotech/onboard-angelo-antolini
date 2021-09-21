import * as dotenv from 'dotenv';
import { startServer } from '../setup';
import { queryRequest } from './individual-tests/query-test';
import supertest = require('supertest');
import { expect } from 'chai';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';
import { hash } from 'bcrypt';
import { savingUser } from '../faker/index';

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

const userCreation = (query) => {
  return supertest(`http://localhost:${process.env.PORT}`).post('/').send({
    query,
  });
};

describe('Database test', function () {
  it('should send an input, check the response and check if the user was creatred in the database', async () => {
    const send = await userCreation(
      `mutation{
        createUser(name: "test_name", email: "test_name@email.com", password: "senhainquebravel1", birthDate: "05/12/1999", token: "eyJhbGciOiJIUzI1NiJ9.dmVyaWZ5aWVk.JmT4Z2ZWJmtxlnaApsxlOB463KagGESrvLV59tonjfY"){
          name
          email
          birthDate
          id
        }
      }`,
    );

    expect(send.statusCode).to.equal(200);

    const user = send.body.data.createUser;

    expect(user.name).to.equal('test_name');
    expect(user.email).to.equal('test_name@email.com');
    expect(user.birthDate).to.equal('05/12/1999');
    expect(user.id).to.greaterThan(0);

    const repository = getRepository(User);
    const test = await repository.findOne({ name: 'test_name' });

    expect(test.name).to.equal('test_name');
    expect(test.email).to.equal('test_name@email.com');
    expect(test.birthDate).to.equal('05/12/1999');
    expect(test.id).to.greaterThan(0);
  });
});

describe('Query test', function () {
  it('should query user by id', async () => {
    const repository = getRepository(User);
    const user = new User();
    user.name = 'test_name';
    user.email = 'test_name@email.com';
    user.password = 'senhaok1';
    user.birthDate = '05/12/1999';
    await repository.save(user);
    const idQuery = await (await repository.findOne({ name: 'test_name' })).id;
    const findUser = await userCreation(`
    query{
      user(id:${idQuery}){
        name
        email
        birthDate
      }
    }`);
    const queryiedUser = findUser.body.data.user;
    expect(queryiedUser.name).to.equal('test_name');
    expect(queryiedUser.email).to.equal('test_name@email.com');
    expect(queryiedUser.birthDate).to.equal('05/12/1999');
  });
});

describe('input error test', function () {
  it('should return a password error', async () => {
    const shortPassword = await userCreation(
      `mutation{
        createUser(name: "test_name", email: "test_name@email.com", password: "senha1", birthDate: "05/12/1999", token: "eyJhbGciOiJIUzI1NiJ9.dmVyaWZ5aWVk.JmT4Z2ZWJmtxlnaApsxlOB463KagGESrvLV59tonjfY"){
          name
          email
          birthDate
          id
        }
      }`,
    );

    const passwordError = shortPassword.body.errors[0];
    expect(passwordError.message).to.equal('Senha inválida');
    expect(passwordError.code).to.equal(400);

    const noNumberPassword = await userCreation(
      `mutation{
        createUser(name: "test_name", email: "test_name@email.com", password: "senhasenha", birthDate: "05/12/1999", token: "eyJhbGciOiJIUzI1NiJ9.dmVyaWZ5aWVk.JmT4Z2ZWJmtxlnaApsxlOB463KagGESrvLV59tonjfY"){
          name
          email
          birthDate
          id
        }
      }`,
    );
    const passwordError2 = noNumberPassword.body.errors[0];
    expect(passwordError2.message).to.equal('Senha inválida');
    expect(passwordError2.code).to.equal(400);

    const noLetterPassword = await userCreation(
      `mutation{
        createUser(name: "test_name", email: "test_name@email.com", password: "123456789", birthDate: "05/12/1999", token: "eyJhbGciOiJIUzI1NiJ9.dmVyaWZ5aWVk.JmT4Z2ZWJmtxlnaApsxlOB463KagGESrvLV59tonjfY"){
          name
          email
          birthDate
          id
        }
      }`,
    );
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

    const secondUser = await userCreation(
      `mutation{
        createUser(name: "test_name2", email: "test_name@email.com", password: "senhaok2", birthDate: "06/12/1999", token: "eyJhbGciOiJIUzI1NiJ9.dmVyaWZ5aWVk.JmT4Z2ZWJmtxlnaApsxlOB463KagGESrvLV59tonjfY"){
          name
          email
          birthDate
          id
        }
      }`,
    );
    const emailError = secondUser.body.errors[0];
    expect(emailError.message).to.equal('Esse e-mail já está cadastrado');
    expect(emailError.code).to.equal(400);
  });
});

describe('Login test', function () {
  it('Should check the login setup', async () => {
    const repository = getRepository(User);
    const user = new User();
    user.name = 'test_name';
    user.email = 'test_name@email.com';
    user.password = await hash('senhaok1', 0);
    user.birthDate = '05/12/1999';
    await repository.save(user);

    const loginResponse = await userCreation(`
      mutation{
        login(email: "test_name@email.com", password: "senhaok1") {
          user {
          name
          email
          birthDate
          id
          } 
          token
        }
      }
    `);

    const login = loginResponse.body.data.login;

    expect(login.user.name).to.equal('test_name');
    expect(login.user.email).to.equal('test_name@email.com');
    expect(login.user.birthDate).to.equal('05/12/1999');
    expect(login.user.id).to.greaterThan(0);
    expect(login.token).to.equal('eyJhbGciOiJIUzI1NiJ9.dmVyaWZ5aWVk.JmT4Z2ZWJmtxlnaApsxlOB463KagGESrvLV59tonjfY');
  });
  it('should return a login error', async () => {
    const repository = getRepository(User);
    const user = new User();
    user.name = 'test_name';
    user.email = 'test_name@email.com';
    user.password = await hash('senhaok1', 0);
    user.birthDate = '05/12/1999';
    await repository.save(user);

    const inexistingEmail = await userCreation(`
      mutation{
        login(email: "wrong_test_name@email.com", password: "senhaok1") {
          user {
          name
          email
          birthDate
          id
          } 
          token
        }
      }
    `);

    const emailError = inexistingEmail.body.errors[0];
    expect(emailError.message).to.equal('Email não cadastrado');
    expect(emailError.code).to.equal(400);

    const wrongPassword = await userCreation(`
      mutation{
        login(email: "test_name@email.com", password: "senhanotok1") {
          user {
          name
          email
          birthDate
          id
          } 
          token
        }
      }
    `);
    const passwordError = wrongPassword.body.errors[0];
    expect(passwordError.message).to.equal('Senha incorreta');
    expect(passwordError.code).to.equal(400);
  });
});

describe('User list test', function () {
  it('shoul query an certain amount of users', async () => {
    await savingUser();
    const page = await userCreation(`
    query{
      users(quantity: 5, page: 5) {
        list  {
          name
        }pageAfter
        pageBefore
        shown
      }
    }
    `);
    console.log(page.body.data.users.list);
    expect(page.body.data.users.list).;
  });
});
