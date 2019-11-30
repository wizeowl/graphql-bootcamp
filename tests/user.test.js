import 'cross-fetch/polyfill';
import ApolloBoost, { gql } from 'apollo-boost';

const client = new ApolloBoost({
  uri: `http://localhost:${process.env.PORT}`
});
