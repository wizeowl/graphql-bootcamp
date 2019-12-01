import { gql } from 'apollo-boost';

export const updatePostMutation = gql`
  mutation($id: ID!, $data: UpdatePostInput!) {
    updatePost(id: $id, data: $data) {
      id
      title
      body
    }
  }
`;

export const createPostMutation = gql`
  mutation($data: CreatePostInput!) {
    createPost(data: $data) {
      id
      title
      body
      published
      author {
        id
      }
    }
  }
`;

export const deletePostMutation = gql`
  mutation($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`;
