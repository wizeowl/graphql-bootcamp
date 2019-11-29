import { validateAndHashPassword } from '../utils/validateAndHashPassword';
import { seedComments, seedPosts, seedUsers } from './seeds';
import { prisma } from '../prisma';

const createTestData = async () => {
  const start = new Date();
  const password = await validateAndHashPassword('azertyui');

  await Promise.all(
    seedUsers(100, password).map(user =>
      prisma.mutation.createUser({ data: user })
    )
  );
  const users = await prisma.query.users(null, '{ id }');

  await Promise.all(
    seedPosts(500, users).map(post =>
      prisma.mutation.createPost({ data: post })
    )
  );
  const posts = await prisma.query.posts(null, '{ id }');

  await Promise.all(
    seedComments(1000, users, posts).map(comment =>
      prisma.mutation.createComment({ data: comment })
    )
  );

  const end = new Date();
  const duration = (end - start) / 1000;
  console.log(`took ${duration} s`);
};

createTestData();
