import { GraphQLServer } from 'graphql-yoga';

import db from './db';
import { Comment } from "./resolvers/Comment";
import { Mutation } from "./resolvers/Mutation/Mutation";
import { Post } from "./resolvers/Post";
import { Query } from "./resolvers/Query";
import { User } from "./resolvers/User";

const resolvers = {
  Query,
  Post,
  User,
  Comment,
  Mutation
};

const server = new GraphQLServer({
  resolvers,
  typeDefs: './src/schema.graphql',
  context: { db }
});

server.start(() => {
  console.log("server up");
});
