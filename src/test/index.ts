import * as dotenv from 'dotenv';
import { startServer } from '../setup';
import { queryRequest } from './individual-tests/query-test';
import supertest = require('supertest');
import { expect } from 'chai';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';

before(async () => {
  dotenv.config({ path: `${__dirname}/../../test.env` });
  await startServer();
});

describe('Query test', function () {
  it('should query Hello', async () => {
    const query = await queryRequest(`query { hello }`);
    expect(query.body.data.hello).to.equal('hello world');
  });
});

const userCreation = (query, mutation) => {
  return supertest(`http://localhost:${process.env.PORT}`).post('/').send({
    mutation,
    query,
  });
};

describe('Database test', function () {
  afterEach(async () => {
    const repository = getRepository(User);
    await repository.clear();
    const clear = await repository.count();
    expect(clear).to.equal(0);
  });

  it('should send an input, check the response and check if the user was creatred in the database', async () => {
    const send = await userCreation(
      `mutation{
        createUser(name: "test_name", email: "test_name@email.com", password: "senhainquebravel1", birthDate: "05/12/1999"){
          name
          email
          birthDate
          id
        }
      }`,
      `query { hello }`,
    );

    expect(send.statusCode).to.equal(200);

    const user = send.body.data.createUser;

    expect(user.name).to.equal('test_name');
    expect(user.email).to.equal('test_name@email.com');
    expect(user.birthDate).to.equal('05/12/1999');
    expect(user.id).to.exist;

    const repository = getRepository(User);
    const test = await repository.findOne({ name: 'test_name' });

    expect(test.name).to.equal('test_name');
    expect(test.email).to.equal('test_name@email.com');
    expect(test.birthDate).to.equal('05/12/1999');
    expect(test.id).to.exist;
  });
});
