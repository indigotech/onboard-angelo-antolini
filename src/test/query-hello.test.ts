import { queryRequest } from './constants';
import { expect } from 'chai';

export const queryTest = describe('Query test', function () {
  it('should query Hello', async () => {
    const query = await queryRequest(`query { hello }`, {});

    expect(query.body.data.hello).to.equal('hello world');
  });
});
