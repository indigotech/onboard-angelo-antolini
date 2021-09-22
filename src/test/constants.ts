import supertest = require('supertest');

export const queryRequest = (query: string, variables) => {
  return supertest(`http://localhost:${process.env.PORT}`).post('/').send({
    query,
    variables,
  });
};

export const userCreation = (query, variables, token?) => {
  return supertest(`http://localhost:${process.env.PORT}`)
    .post('/')
    .set('Authorization', token ?? '')
    .send({
      query,
      variables,
    });
};

export const createMutation = `
mutation CreateUser($data: UserInput!) {
  createUser(data: $data) {
    id
    name
    email
    birthDate
  }
}
`;

export const loginMutation = `
mutation ($data : LoginInput!){
  login(data: $data) {
    user {
    name
    email
    birthDate
    id
    } 
    token
  }
}
`;

export const queryUser = `
query ($id: Int!){
  user(id: $id){
    name
    email
    birthDate
  }
}
`;
