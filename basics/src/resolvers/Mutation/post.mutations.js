import uuidv4 from "uuid/v4";

export const createPost = (parent, { data }, { pubsub, db: { posts, users } }, info) => {
  const userExists = users.some(u => u.id === data.author);
  if (!userExists) {
    throw new Error('User does not Exist');
  }

  const post = { id: uuidv4(), ...data };
  posts.push(post);

  if (post.published) {
    pubsub.publish('post', { post });
  }

  return post;
};

export const updatePost = (parent, { id, data }, { db: { posts } }, info) => {
  const postIndex = posts.findIndex(p => p.id === id);
  if (postIndex < 0) {
    throw new Error('Post does not exist');
  }

  const post = { ...posts[postIndex], ...data };
  posts[postIndex] = post;
  return post;
};

export const deletePost = (parent, { id }, { db }, info) => {
  const postIndex = db.posts.findIndex(p => p.id === id);
  if (postIndex < 0) {
    throw new Error('Post does not exist');
  }

  const [post] = db.posts.splice(postIndex, 1);
  db.comments = db.comments.filter(c => c.post === id);

  return post;
};
