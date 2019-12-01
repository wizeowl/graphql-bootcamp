import * as jwt from 'jsonwebtoken';
import { validateAndHashPassword } from '../../src/utils/validateAndHashPassword';
import { prisma } from '../../src/prisma';

export const dummyUser1 = {
  name: 'Al Pacino',
  email: 'amigo@example.com'
};
export const dummyUser2 = {
  name: 'Alex Moreno',
  email: 'moreno@example.com'
};

export const userOne = { input: dummyUser1, user: null, jwt: null };
export const userTwo = { input: dummyUser2, user: null, jwt: null };
export const testPosts = { posts: [] };

export const seed = async (debug = false) => {
  const password = await validateAndHashPassword('azertyui');

  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();

  userOne.user = await prisma.mutation.createUser({
    data: { ...dummyUser1, password }
  });
  userOne.jwt = jwt.sign(
    { userId: userOne.user.id },
    process.env.JWT_SECRET
  );
  userTwo.user = await prisma.mutation.createUser({
    data: { ...dummyUser2, password }
  });
  userTwo.jwt = jwt.sign(
    { userId: userTwo.user.id },
    process.env.JWT_SECRET
  );

  const post1 = await prisma.mutation.createPost({
    data: {
      title: 'Post 1',
      body: 'Body 1',
      published: true,
      author: { connect: { email: dummyUser1.email } }
    }
  });

  const post2 = await prisma.mutation.createPost({
    data: {
      title: 'Post 2',
      body: 'Body 2',
      published: false,
      author: { connect: { email: dummyUser1.email } }
    }
  });

  testPosts.posts = [post1, post2];

  if (debug) {
    console.log(userOne);
    console.log(userTwo);
    console.log(testPosts);
  }
};
