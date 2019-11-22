import { createComment, deleteComment, updateComment } from "./comment.mutations";
import { createPost, deletePost, updatePost } from "./post.mutations";
import { createUser, deleteUser, updateUser } from "./user.mutations";

export const Mutation = {
  createUser,
  updateUser,
  deleteUser,

  createPost,
  updatePost,
  deletePost,

  createComment,
  updateComment,
  deleteComment
};
