import { GraphQLServer, PubSub } from 'graphql-yoga';

import db from './db';
import { Comment } from "./resolvers/Comment";
import { Mutation } from "./resolvers/Mutation/Mutation";
import { Post } from "./resolvers/Post";
import { Query } from "./resolvers/Query";
import { Subscription } from "./resolvers/Subscription";
import { User } from "./resolvers/User";
import {prisma } from "./prisma";

const pubsub = new PubSub();

const resolvers = {
  Query,
  Post,
  User,
  Comment,
  Mutation,
  Subscription
};

const server = new GraphQLServer({
  resolvers,
  typeDefs: './src/schema.graphql',
  context: { db, pubsub, prisma }
});

server.start(() => {
  console.log("server up");
});
