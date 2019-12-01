import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';

import { prisma } from '../src/prisma';
import { client, seed } from './seed/seed';

describe('User', () => {
  beforeEach(seed);

  const createUser = (name, email, password) => gql`
    mutation {
      createUser(
        data: {
          email: "${email}"
          name: "${name}"
          password: "${password}"
        }
      ) {
        token
        user {
          name
          id
          email
        }
      }
    }
  `;

  it('Should create a User', async () => {
    const name = 'Gabi Gabino';
    const email = 'gabi2@gmail.com';
    const password = 'azertyui';

    const {
      data: {
        createUser: { token, user }
      }
    } = await client.mutate({
      mutation: createUser(name, email, password)
    });

    expect(token).toBeTruthy();
    expect(user.name).toBeTruthy();
    expect(user.name).toEqual(name);
    expect(user.id).toBeTruthy();

    const userExists = await prisma.exists.User({
      name,
      email,
      id: user.id
    });

    expect(userExists).toBeTruthy();
  });

  it('Should expose public author profiles', async () => {
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
    expect(users).toBeTruthy();
    expect(users.length).toEqual(1);
    const [user] = users;
    expect(user.email).toBeFalsy();
  });

  it('Should fail to login with bad credentials', async () => {
    const login = (email, password) => gql`
      mutation {
        login(
          data: { email: "${email}", password: "${password}" }
        ) {
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
        mutation: login('anybody@example.com', 'azertyui')
      })
    ).rejects.toThrow();

    await expect(
      client.mutate({
        mutation: login('amigo@example.com', 'qsdfghjk')
      })
    ).rejects.toThrow();
  });

  it('Should fail to create User with a short password', async () => {
    await expect(
      client.mutate({
        mutation: createUser(
          'Mona Lisa',
          'monalisa@example.com',
          'pazerty'
        )
      })
    ).rejects.toThrow();
  });
});
