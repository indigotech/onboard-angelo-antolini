import * as dotenv from 'dotenv';
import { startServer } from '../setup';
import { expect } from 'chai';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';

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

require('./query-hello.test');
require('./createUser.test');
require('./login.test');
require('./user-query.test');
require('./users-query.test');
