import uuidv4 from "uuid/v4";
import { CREATED, DELETED, UPDATED } from "../Subscription";

export const createPost = (parent, { data }, { pubsub, db: { posts, users } }, info) => {
  const userExists = users.some(u => u.id === data.author);
  if (!userExists) {
    throw new Error('User does not Exist');
  }

  const post = { id: uuidv4(), ...data };
  posts.push(post);

  if (post.published) {
    pubsub.publish('post', { post: { data: post, mutation: CREATED } });
  }

  return post;
};

export const updatePost = (parent, { id, data }, { db: { posts } }, info) => {
  const postIndex = posts.findIndex(p => p.id === id);
  if (postIndex < 0) {
    throw new Error('Post does not exist');
  }

  const originalPost = { ...posts[postIndex] };
  const post = { ...posts[postIndex], ...data };
  posts[postIndex] = post;

  if (typeof data.published === 'boolean') {
    if (originalPost.published && !data.published) {
      pubsub.publish('post', {
        post: { data: originalPost, mutation: DELETED }
      });
    } else if (!originalPost.published && data.published) {
      pubsub.publish('post', {
        post: { data: post, mutation: CREATED }
      });
    }
  } else {
    pubsub.publish('post', {
      post: { data: post, mutation: UPDATED }
    });
  }

  return post;
};

export const deletePost = (parent, { id }, { db, pubsub }, info) => {
  const postIndex = db.posts.findIndex(p => p.id === id);
  if (postIndex < 0) {
    throw new Error('Post does not exist');
  }

  const [post] = db.posts.splice(postIndex, 1);
  db.comments = db.comments.filter(c => c.post === id);

  if (post.published) {
    pubsub.publish('post', {
      post: {
        mutation: 'DELETED',
        data: post
      }
    });
  }

  return post;
};
