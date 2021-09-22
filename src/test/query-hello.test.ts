import { queryRequest } from './constants';
import { expect } from 'chai';

<<<<<<< HEAD
export const queryTest = describe('Query test', function () {
=======
describe('Query hello test', function () {
>>>>>>> f3dc2aa... teste erro query
  it('should query Hello', async () => {
    const query = await queryRequest(`query { hello }`, {});

    expect(query.body.data.hello).to.equal('hello world');
  });
});
