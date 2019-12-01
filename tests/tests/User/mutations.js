import { gql } from 'apollo-boost';

export const createUser = gql`
  mutation($data: CreateUserInput!) {
    createUser(data: $data) {
      token
      user {
        name
        id
        email
      }
    }
  }
`;

export const loginMutation = gql`
  mutation($data: LoginInput) {
    login(data: $data) {
      token
      user {
        id
        name
      }
    }
  }
`;
