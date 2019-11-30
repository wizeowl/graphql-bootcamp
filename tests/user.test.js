import 'cross-fetch/polyfill';
import ApolloBoost, { gql } from 'apollo-boost';
import { prisma } from '../src/prisma';
import { validateAndHashPassword } from '../src/utils/validateAndHashPassword';

const client = new ApolloBoost({
  uri: `http://localhost:${process.env.PORT}`
});

const dummyUser = {
  name: 'Al Pacino',
  email: 'amigo@example.com'
};

beforeEach(async () => {
  const password = await validateAndHashPassword('azertyui');

  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();
  await prisma.mutation.createUser({
    data: { ...dummyUser, password }
  });

  await prisma.mutation.createPost({
    data: {
      title: 'Post 1',
      body: 'Body 1',
      published: true,
      author: { connect: { email: dummyUser.email } }
    }
  });

  await prisma.mutation.createPost({
    data: {
      title: 'Post 2',
      body: 'Body 2',
      published: false,
      author: { connect: { email: dummyUser.email } }
    }
  });
});

test('Should create a User', async () => {
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

test('Should expose public author profiles', async () => {
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
