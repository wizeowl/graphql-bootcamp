export const Post = {
  author({ author }, args, { db: { users } }, info) {
    return users.find(user => user.id === author);
  },
  comments({ id }, args, { db: { comments } }, info) {
    return comments.filter(comment => comment.post === id);
  }
};
