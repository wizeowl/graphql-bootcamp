import uuidv4 from 'uuid/v4';

export const Mutation = {
  createUser(parent, { data }, { db: { users } }, info) {
    const emailTaken = users.some(u => u.email === data.email);
    if (emailTaken) {
      throw new Error('Email taken');
    }

    const user = { id: uuidv4(), ...data };
    users.push(user);
    return user;
  },
  deleteUser(parent, { id }, { db }, info) {
    const userIndex = db.users.findIndex(u => u.id === id);
    if (userIndex < 0) {
      throw new Error('User does not Exist');
    }

    const [user] = db.users.splice(userIndex, 1);
    db.posts = db.posts.filter(p => {
      const match = p.author === id;

      if (match) {
        db.comments = db.comments.filter(c => c.post === p.id);
      }

      return !match;
    });
    db.comments = db.comments.filter(c => c.author !== id);

    return user;
  },
  createPost(parent, { data }, { db: { posts, users } }, info) {
    const userExists = users.some(u => u.id === data.author);
    if (!userExists) {
      throw new Error('User does not Exist');
    }

    const post = { id: uuidv4(), ...data };
    posts.push(post);
    return post;
  },
  deletePost(parent, { id }, { db }, info) {
    const postIndex = db.posts.findIndex(p => p.id === id);
    if (postIndex < 0) {
      throw new Error('Post does not exist');
    }

    const [post] = db.posts.splice(postIndex, 1);
    db.comments = db.comments.filter(c => c.post === id);

    return post;
  },
  createComment(parent, { data }, { db: { users, posts, comments } }, info) {
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
    return comment;
  },
  deleteComment(parent, { id }, { db }, info) {
    const commentIndex = db.comments.findIndex(c => c.id === id);
    if (commentIndex < 0) {
      throw  new Error('comment does not exist');
    }

    const [comment] = db.comments.splice(commentIndex, 1);
    return comment;
  }
};
