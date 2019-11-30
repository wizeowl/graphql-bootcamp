import 'cross-fetch/polyfill';
import ApolloBoost, { gql } from 'apollo-boost';
import { prisma } from '../src/prisma';

const client = new ApolloBoost({
  uri: `http://localhost:${process.env.PORT}`
});

beforeEach(async () => {
  await prisma.mutation.deleteManyUsers();
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
