import uuidv4 from "uuid/v4";
import { CREATED, DELETED, UPDATED } from "../Subscription";

export const createComment = (parent, { data }, { db: { users, posts, comments }, pubsub }, info) => {
  const userExists = users.some(u => u.id === data.author);
  if (!userExists) {
    throw new Error('User does not Exist');
  }
  const postExists = posts.some(p => p.id === data.post);
  if (!postExists) {
    throw new Error('Post does not Exist');
  }

  const comment = { id: uuidv4(), ...data };

  comments.push(comment);
  pubsub.publish(`comment ${data.post}`, {
    comment: { data: comment, mutation: CREATED }
  });

  return comment;
};

export const updateComment = (parent, { id, data }, { pubsub, db: { comments } }, info) => {
  const commentIndex = comments.findIndex(c => c.id === id);
  if (commentIndex < 0) {
    throw new Error('Comment does not Exist');
  }

  const comment = { ...comments[commentIndex], ...data };

  comments[commentIndex] = comment;
  pubsub.publish(`comment ${comment.post}`, {
    comment: { data: comment, mutation: UPDATED }
  });

  return comment;
};

export const deleteComment = (parent, { id }, { pubsub, db }, info) => {
  const commentIndex = db.comments.findIndex(c => c.id === id);
  if (commentIndex < 0) {
    throw  new Error('comment does not exist');
  }

  const [comment] = db.comments.splice(commentIndex, 1);
  pubsub.publish(`comment ${comment.post}`, {
    comment: { data: comment, mutation: DELETED }
  });

  return comment;
};
