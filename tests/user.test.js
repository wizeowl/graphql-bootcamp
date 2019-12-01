import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';

import { prisma } from '../src/prisma';
import { getClient } from './util/getClient';
import { seed, userOne } from './util/seed';

const client = getClient();

describe('User', () => {
  beforeEach(seed);

  const createUser = gql`
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

  const meQuery = gql`
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

  it('should create a User', async () => {
    const variables = {
      data: {
        name: 'Gabi Gabino',
        email: 'gabi2@gmail.com',
        password: 'azertyui'
      }
    };

    const {
      data: {
        createUser: { token, user }
      }
    } = await client.mutate({
      mutation: createUser,
      variables
    });

    expect(token).toBeTruthy();
    expect(user.name).toBeTruthy();
    expect(user.id).toBeTruthy();

    const userExists = await prisma.exists.User({
      name: variables.name,
      email: variables.email,
      id: user.id
    });

    expect(userExists).toBeTruthy();
  });

  it('should fail to create User with a short password', async () => {
    const variables = {
      data: {
        name: 'Mona Lisa',
        email: 'monalisa@example.com',
        password: 'pazerty'
      }
    };
    await expect(
      client.mutate({
        mutation: createUser,
        variables
      })
    ).rejects.toThrow();
  });

  it('should expose public author profiles', async () => {
    const query = gql`
      query {
        users {
          id
          name
          email
        }
      }
    `;

    const {
      data: { users }
    } = await client.query({ query });

    users.forEach(user => {
      expect(user.name).toBeTruthy();
      expect(user.email).toBeFalsy();
    });
  });

  it('should fail to login with bad credentials', async () => {
    const login = gql`
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

    await expect(
      client.mutate({
        mutation: login,
        variables: {
          data: {
            email: 'anybody@example.com',
            password: 'azertyui'
          }
        }
      })
    ).rejects.toThrow();

    await expect(
      client.mutate({
        mutation: login,
        variables: {
          data: {
            email: 'amigo@example.com',
            password: 'qsdfghjk'
          }
        }
      })
    ).rejects.toThrow();
  });

  it('should fail to get user profile without Authentication', async () => {
    await expect(client.query({ query: meQuery })).rejects.toThrow();
  });

  it('should get user profile only if using authentication', async () => {
    const authenticatedClient = getClient(userOne.jwt);

    const {
      data: {
        me: { id, name, email, posts }
      }
    } = await authenticatedClient.query({ query: meQuery });
    expect(id).toEqual(userOne.user.id);
    expect(name).toEqual(userOne.user.name);
    expect(email).toEqual(userOne.user.email);
    expect(Array.isArray(posts)).toEqual(true);
  });
});
