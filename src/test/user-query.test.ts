import { expect } from 'chai';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';
import { queryRequest, queryUser } from './constants';
import { sign } from 'jsonwebtoken';

export const queryUserTest = describe('Query user test', function () {
  it('should query user by id', async () => {
    const repository = getRepository(User);

    const user = new User();
    user.name = 'test_name';
    user.email = 'test_name@email.com';
    user.password = 'senhaok1';
    user.birthDate = '05/12/1999';

    await repository.save(user);

    const idQuery = (await repository.findOne({ name: 'test_name' })).id;
    const token = sign({ id: idQuery }, 'supersecret');
    const findUser = await queryRequest(queryUser, { id: idQuery }, token);

    const queryiedUser = findUser.body.data.user;
    expect(queryiedUser.name).to.equal('test_name');
    expect(queryiedUser.email).to.equal('test_name@email.com');
    expect(queryiedUser.birthDate).to.equal('05/12/1999');
  });

  it('should return a not found id error', async () => {
    const token = sign({ id: 1 }, 'supersecret');
    const findUser = await queryRequest(queryUser, { id: 1 }, token);

    const queryError = findUser.body.errors[0];
    expect(queryError.message).to.equal('Usuário não encontrado');
    expect(queryError.code).to.equal(404);
  });
});
