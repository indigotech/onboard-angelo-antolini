import * as faker from 'faker';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';
import * as dotenv from 'dotenv';
import { startServer } from '../setup';
import { createConnection } from 'typeorm';

const savingUser = async () => {
  dotenv.config({ path: `${__dirname}/../../test.env` });
  await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: ['src/entity/**/*.ts'],
    synchronize: true,
  });

  const repository = getRepository(User);
  for (let i = 0; i < 2; i++) {
    const user = new User();

    user.name = faker.name.firstName(1);
    user.email = faker.internet.email(user.name);
    user.birthDate = faker.date.past().toString();
    user.password = faker.random.alphaNumeric(8);

    await repository.save(user);
  }
};

savingUser();
