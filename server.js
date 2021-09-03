var { graphql, buildSchema } = require ('graphql');

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
