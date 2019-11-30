import faker from 'faker';

const range = length =>
  Array.apply(null, Array(length)).map((_, i) => i);
const name = () =>
  `${faker.name.findName()} ${faker.name.lastName()}`;
const age = () => Math.round(Math.random() * 80) + 10;
const rand = n => Math.floor(Math.random() * n);
const pickRand = coll => coll[rand(coll.length)];
const coinFlip = () => Math.random() > 0.5;

export const seedUsers = (length, password) =>
  range(length).map(() => ({
    password,
    name: name(),
    email: faker.internet.email().toLowerCase()
  }));

export const seedPosts = (length, users) =>
  range(length).map(() => ({
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(),
    published: coinFlip(),
    author: { connect: { id: pickRand(users).id } }
  }));

export const seedComments = (length, users, posts) =>
  range(length).map(() => ({
    text: faker.lorem.sentence(),
    post: { connect: { id: pickRand(posts).id } },
    author: { connect: { id: pickRand(users).id } }
  }));
