import '@babel/polyfill/noConflict';
import { GraphQLServer } from 'graphql-yoga';

import db from './db';
import { prisma } from './prisma';
import { fragmentReplacements, resolvers } from './resolvers';

const server = new GraphQLServer({
  resolvers,
  typeDefs: './src/schema.graphql',
  context(request) {
    return { db, prisma, request };
  },
  fragmentReplacements
});

server.start({ port: process.env.PORT || 4000 }, () => {
  console.log('server up');
});
