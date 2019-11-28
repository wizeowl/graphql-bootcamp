import { Prisma } from 'prisma-binding';

import { fragmentReplacements } from "./resolvers";

export const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466',
  secret: 'sottachsba3tach7obbimejech',
  fragmentReplacements
});
