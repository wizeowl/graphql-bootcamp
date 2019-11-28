import { extractFragmentReplacements } from 'prisma-binding';

import { Comment } from "./Comment";
import { Mutation } from "./Mutation/Mutation";
import { Post } from "./Post";
import { Query } from "./Query";
import { Subscription } from "./Subscription";
import { User } from "./User";

export const resolvers = {
  Query,
  Post,
  User,
  Comment,
  Mutation,
  Subscription
};

export const fragmentReplacements = extractFragmentReplacements(resolvers);
