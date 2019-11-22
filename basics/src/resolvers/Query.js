export const Query = {
  me(parent, args, { db: { users } }) {
    return users[0];
  },
  users(parent, { query }, { db: { users } }, info) {
    if (query) {
      return users.filter(user => user.name.toLowerCase().includes(query.toLowerCase()));
    }
    return users;
  },
  posts(parent, { query }, { db: { posts } }, info) {
    if (query) {
      return posts.filter(post =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.body.toLowerCase().includes(query.toLowerCase())
      );
    }
    return posts;
  },
  comments(parent, { query }, { db: { comments } }, info) {
    if (query) {
      return comments.filter(comment => comment.text === query);
    }
    console.log(comments);
    return comments;
  }
};
