import supertest = require('supertest');

export const queryRequest = (query: string) => {
  return supertest(`http://localhost:${process.env.PORT}`).post('/').send({
    query,
  });
};
