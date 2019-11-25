import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466'
});

const test = async () => {
  const exists = await prisma.exists.User({ id: 'ck3edzesp001j0844yujh6w9p' });
  console.log(exists);
};

test();

// hgl$fhsHG84d4

