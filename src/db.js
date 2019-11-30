import { seedComments, seedPosts, seedUsers } from './data/seeds';

const users = seedUsers(20);

const posts = seedPosts(50, users);

const comments = seedComments(500, users, posts);

const db = { users, posts, comments };

export { db as default };
