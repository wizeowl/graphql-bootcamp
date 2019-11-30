import { GraphQLServer } from 'graphql-yoga';
import { prisma } from './prisma';
import { fragmentReplacements, resolvers } from './resolvers';

const server = new GraphQLServer({
  resolvers,
  typeDefs: './src/schema.graphql',
  context(request) {
    return { prisma, request };
  },
  fragmentReplacements
});

export { server as default };
