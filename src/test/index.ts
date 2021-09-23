import * as dotenv from 'dotenv';
import { startServer } from '../setup';
import { expect } from 'chai';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';
import { queryTest } from './query-hello.test';
import { createUserTest } from './createUser.test';
import { loginTest } from './login.test';

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

queryTest;
loginTest;
createUserTest;
