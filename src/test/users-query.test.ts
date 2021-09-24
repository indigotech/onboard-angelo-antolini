import { expect } from 'chai';
import { sign } from 'jsonwebtoken';
import { savingUser } from '../faker';
import { ListInput } from '../schema-types';
import { queryRequest, queryUsers } from './constants';

describe('Users list query test', function () {
  it('should populate the database with faker and query a middle page with 4 users of a total of 50', async () => {
    await savingUser();

    const data: ListInput = {
      page: 5,
      quantity: 4,
    };
    const token = sign({ id: 1 }, 'supersecret');

    const usersList = await queryRequest(queryUsers, { data }, token);
    const users = usersList.body.data.users;

    expect(users.list).to.have.lengthOf(4);
    expect(users.pageBefore).to.be.true;
    expect(users.pageAfter).to.be.true;
    expect(users.totalUsers).to.equal('50');
  });
  it('should query the first page and return pageBefore false', async () => {
    await savingUser();

    const data: ListInput = {
      page: 1,
      quantity: 4,
    };
    const token = sign({ id: 1 }, 'supersecret');

    const usersList = await queryRequest(queryUsers, { data }, token);
    const pageBefore = usersList.body.data.users.pageBefore;

    expect(pageBefore).to.be.false;
  });

  it('should query the last page, return pageAfter false and have less users than the quantity input', async () => {
    await savingUser();

    const data: ListInput = {
      page: 9,
      quantity: 6,
    };
    const token = sign({ id: 1 }, 'supersecret');

    const usersList = await queryRequest(queryUsers, { data }, token);
    const users = usersList.body.data.users;

    expect(users.pageAfter).to.be.false;
    expect(users.list).to.have.lengthOf(2);
  });

  it('should return an error if the users passes a page with number 0', async () => {
    await savingUser();

    const data: ListInput = {
      page: 0,
      quantity: 6,
    };
    const token = sign({ id: 1 }, 'supersecret');

    const usersList = await queryRequest(queryUsers, { data }, token);
    const pageError = usersList.body.errors[0];

    expect(pageError.message).to.equal('Esta página não existe');
    expect(pageError.code).to.equal(404);
  });

  it('should return an error if the users passes a page that doesn`t exist', async () => {
    await savingUser();

    const data: ListInput = {
      page: 50,
      quantity: 6,
    };
    const token = sign({ id: 1 }, 'supersecret');

    const usersList = await queryRequest(queryUsers, { data }, token);
    const pageError = usersList.body.errors[0];

    expect(pageError.message).to.equal('Esta página não existe');
    expect(pageError.code).to.equal(404);
  });

  it('should return an error if the users chooses to query 0 users per page', async () => {
    await savingUser();

    const data: ListInput = {
      page: 5,
      quantity: 0,
    };
    const token = sign({ id: 1 }, 'supersecret');

    const usersList = await queryRequest(queryUsers, { data }, token);
    const pageError = usersList.body.errors[0];

    expect(pageError.message).to.equal('Quantidade inválida de usuários');
    expect(pageError.code).to.equal(400);
  });
});
