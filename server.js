import { graphql, buildSchema } from 'graphql';

const schema = buildSchema(`
    type Query{
        hello: String
    }
`);

var resp = {
  Hello: () => {
    return 'Hello world';
  },
};

graphql(schema, '{ hello }', resp).then((response) => {
  console.log(response);
});
