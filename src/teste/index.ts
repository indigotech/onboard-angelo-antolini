import * as dotenv from 'dotenv';
import { startServer } from '../setup';
import { before, describe } from 'mocha';
import request = require('supertest');
import { resolvers } from '../resolver';

before(async () => {
  dotenv.config({ path: `${__dirname}/../../test.env` });
  await startServer();
  console.log('Conexão estabelecida');
});

describe('Query test', function () {
  it('should query Hello', async () => {
    request(startServer).get('/').query({ val: 'hello' }).expect('hello world');
  });
});
