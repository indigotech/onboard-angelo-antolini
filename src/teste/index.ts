import * as dotenv from 'dotenv';
import { startServer } from '../setup';
import { before, describe } from 'mocha';
import request = require('supertest');

before(async () => {
  dotenv.config({ path: `${__dirname}/../../test.env` });
  await startServer;
  console.log('Conexão estabelecida');
});

describe('Query test', function () {
  it('Querys Hello', async () => {
    const query = { query: 'query Hello { hello }' };
  });
});
