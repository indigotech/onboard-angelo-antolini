import * as faker from 'faker';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';

export const savingUser = async () => {
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
