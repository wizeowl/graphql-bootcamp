import ApolloBoost from 'apollo-boost';
import { validateAndHashPassword } from '../../src/utils/validateAndHashPassword';
import { prisma } from '../../src/prisma';

export const client = new ApolloBoost({
  uri: `http://localhost:${process.env.PORT}`
});

export const dummyUser = {
  name: 'Al Pacino',
  email: 'amigo@example.com'
};

export const seed = async () => {
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
};
