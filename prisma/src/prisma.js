import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466'
});

async function init() {
  const post = await prisma.mutation.createPost({
    data: {
      title: "Powst!!",
      body: "My body!!",
      published: true,
      author: { connect: { id: 'ck3edzesp001j0844yujh6w9p' } }
    }
  }, '{ id title body published }');

  console.log(post);

  const users = await prisma.query.users(null, '{ id name posts { id title body published} }');

  console.log(JSON.stringify(users, undefined, 2));
}

init();
