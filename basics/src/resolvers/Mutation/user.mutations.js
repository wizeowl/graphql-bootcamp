import uuidv4 from "uuid/v4";

export const createUser = (parent, { data }, { db: { users } }, info) => {
  const emailTaken = users.some(u => u.email === data.email);
  if (emailTaken) {
    throw new Error('Email taken');
  }

  const user = { id: uuidv4(), ...data };
  users.push(user);
  return user;
};

export const updateUser = (parent, { id, data }, { db: { users } }, info) => {
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex < 0) {
    throw new Error('User does not exist');
  }

  const user = { ...users[userIndex], ...data };
  users[userIndex] = user;
  return user;
};

export const deleteUser = (parent, { id }, { db }, info) => {
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
};
