import * as faker from 'faker';
import { User } from '../entity/User';
import { createConnection, getRepository } from 'typeorm';

const dataBase = async () => {
  const connection = await createConnection({
    type: 'postgres',
    url: 'postgres://postgres:postgres@localhost:5433/test',
    entities: ['src/entity/**/*.ts'],
    synchronize: true,
  });
};
const savingUser = async () => {
  await dataBase();
  const repository = getRepository(User);
  for (let i = 0; i < 50; i++) {
    const user = new User();

    user.name = faker.name.firstName(1);
    user.email = faker.internet.email(user.name);
    user.birthDate = faker.date.past().toString();
    user.password = faker.random.alphaNumeric(8);

    await repository.save(user);
  }
};

savingUser();
