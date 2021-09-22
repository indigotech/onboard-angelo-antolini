import { expect } from 'chai';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';
import { queryRequest, queryUser } from './constants';

afterEach(async () => {
  const repository = getRepository(User);
  await repository.clear();
  const clear = await repository.count();
  expect(clear).to.equal(0);
});

describe('Query user test', function () {
  it('should query user by id', async () => {
    const repository = getRepository(User);

    const user = new User();
    user.name = 'test_name';
    user.email = 'test_name@email.com';
    user.password = 'senhaok1';
    user.birthDate = '05/12/1999';

    await repository.save(user);

    const idQuery = (await repository.findOne({ name: 'test_name' })).id;
    const findUser = await queryRequest(queryUser, { id: idQuery });

    const queryiedUser = findUser.body.data.user;
    expect(queryiedUser.name).to.equal('test_name');
    expect(queryiedUser.email).to.equal('test_name@email.com');
    expect(queryiedUser.birthDate).to.equal('05/12/1999');
  });

  it('should return a not found id error', async () => {
    const findUser = await queryRequest(queryUser, { id: 1 });

    const queryError = findUser.body.errors[0];
    expect(queryError.message).to.equal('Usuário não encontrado');
    expect(queryError.code).to.equal(404);
  });
});
