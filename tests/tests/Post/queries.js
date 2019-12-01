import { gql } from 'apollo-boost';

export const myPostsQuery = gql`
  query {
    myPosts {
      id
      title
      body
      published
      author {
        id
        name
      }
    }
  }
`;

export const postsQuery = gql`
  query {
    posts {
      id
      title
      body
      published
    }
  }
`;
