import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';

import { prisma } from '../src/prisma';
import { client, seed } from './config/testSetup';

describe('User', () => {
  beforeEach(seed);

  it('Should create a User', async () => {
    const name = 'Gabi Gabino';
    const email = 'gabi2@gmail.com';
    const password = 'azertyui';
    const createUser = gql`
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

    const {
      data: {
        createUser: { token, user }
      }
    } = await client.mutate({ mutation: createUser });

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

  it('Should return public posts', async () => {
    const query = gql`
      query {
        posts {
          id
          title
          body
          published
        }
      }
    `;

    const {
      data: { posts }
    } = await client.query({ query });

    expect(posts).toBeTruthy();
    expect(posts.length).toEqual(1);
    const [post] = posts;
    expect(post.published).toBeTruthy();
  });
});
