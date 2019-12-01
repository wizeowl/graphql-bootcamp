import * as jwt from 'jsonwebtoken';
import { validateAndHashPassword } from '../../src/utils/validateAndHashPassword';
import { prisma } from '../../src/prisma';

export const dummyUser = {
  name: 'Al Pacino',
  email: 'amigo@example.com'
};

export const userOne = { input: dummyUser, user: null, jwt: null };

export const seed = async () => {
  const password = await validateAndHashPassword('azertyui');

  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();

  userOne.user = await prisma.mutation.createUser({
    data: { ...dummyUser, password }
  });
  userOne.jwt = jwt.sign(
    { userId: userOne.user.id },
    process.env.JWT_SECRET
  );

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
