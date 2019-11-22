export const Comment = {
  post({ post }, args, { db: { posts } }, info) {
    return posts.find(p => p.id === post);
  },
  author({ author }, args, { db: { users } }, info) {
    return users.find(user => user.id === author);
  }
};
