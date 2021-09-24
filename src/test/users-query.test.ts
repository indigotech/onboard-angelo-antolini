import { expect } from 'chai';
import { sign } from 'jsonwebtoken';
import { savingUser } from '../faker';
import { ListInput } from '../schema-types';
import { queryRequest, queryUsers } from './constants';

describe('Users list query test', function () {
  it('', async () => {
    savingUser();
    const data: ListInput = {
      page: 5,
      quantity: 4,
    };
    const token = sign({ id: 1 }, 'supersecret');

    const usersList = await queryRequest(queryUsers, { data }, token);
    const users = usersList.body.data.users;
    console.log(usersList);

    expect(users.list).to.have.lengthOf(4);
    expect(users.pageBefore).to.be.true;
    expect(users.pageAfter).to.be.true;
  });
});
