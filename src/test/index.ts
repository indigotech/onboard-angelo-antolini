import * as dotenv from 'dotenv';
import { startServer } from '../setup';
import { queryRequest } from './individual-tests/query-test';
import supertest = require('supertest');
import { expect } from 'chai';
import {} from '../schema';

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
/////////////////////////////////////////////////////////////////////////

const userCreation = (query, mutation) => {
  return supertest(`http://localhost:${process.env.PORT}`).post('/').send({
    mutation,
    query,
  });
};

describe('Database test', function () {
  it('should send an input', async () => {
    const send = await userCreation(
      `mutation{
        createUser(name: "nome", email: "userroo@email.com", password: "senhainquebravel1", birthDate: "05/12/1999"){
          name
          email
          birthDate
          id
        }
      }`,
      `query { hello }`,
    );
    console.log(send);
    expect(send.statusCode).to.equal(200);
    expect(send.body.data.createUser.name).to.equal('nome');
    expect(send.body.data.createUser.email).to.equal('userroo@email.com');
    expect(send.body.data.createUser.birthDate).to.equal('05/12/1999');
    expect(send.body.data.createUser.id).to.exist;
  });

  // it('should return the user information except the password', async () => {
  //   const send = await userCreation(create);
  //   expect(send.body.data.mutation.name).to.equal('nome');
  //   expect(send.body.data.mutation.email).to.equal('userr@email.com');
  //   expect(send.body.data.mutation.birthDate).to.equal('05/12/1999');
  //   expect(send.body.data.mutation.id).to.exist;
  // });
});
