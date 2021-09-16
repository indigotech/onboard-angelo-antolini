import * as dotenv from 'dotenv';
import { startServer } from '../setup';
import supertest = require('supertest');
import { expect } from 'chai';

before(async () => {
  dotenv.config({ path: `${__dirname}/../../teste.env` });
  await startServer();
});

const queryRequest = (query: string) => {
  return supertest(`http://localhost:${process.env.PORT}`).post('/').send({
    query,
  });
};

describe('Query test', function () {
  it('should query Hello', async () => {
    const query = await queryRequest(`query { hello }`);
    expect(query.body.data.hello).to.equal('hello world');
  });
});
