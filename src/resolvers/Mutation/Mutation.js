import {
  createComment,
  deleteComment,
  updateComment
} from './comment.mutations';
import { createPost, deletePost, updatePost } from './post.mutations';
import {
  createUser,
  deleteUser,
  login,
  updateUser
} from './user.mutations';

export const Mutation = {
  createUser,
  updateUser,
  deleteUser,
  login,

  createPost,
  updatePost,
  deletePost,

  createComment,
  updateComment,
  deleteComment
};
