import ApolloBoost from 'apollo-boost';

export const getClient = jwt => {
  return new ApolloBoost({
    uri: `http://localhost:${process.env.PORT}`,
    request(operation) {
      if (jwt) {
        operation.setContext({
          headers: { Authorization: `Bearer ${jwt}` }
        });
      }
    }
  });
};
