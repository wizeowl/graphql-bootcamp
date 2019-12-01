import { gql } from 'apollo-boost';

export const usersQuery = gql`
  query {
    users {
      id
      name
      email
    }
  }
`;

export const meQuery = gql`
  query {
    me {
      id
      name
      email
      posts {
        id
        title
        body
        published
      }
    }
  }
`;
