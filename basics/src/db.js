const users = [
  {
    id: 'u1',
    name: 'El Kitni',
    email: 'kitni@server.com',
    age: 93
  }, {
    id: 'u2',
    name: 'El Ajmi',
    email: 'ajmi@server.com',
    age: 93
  }, {
    id: 'u3',
    name: 'El Hani',
    email: 'hani@server.com',
    age: 92
  }
];

const posts = [
  {
    id: 'p1',
    title: 'Title 1 rx',
    body: 'Body Body Body 1! sy',
    published: true,
    author: 'u1'
  }, {
    id: 'p2',
    title: 'Title 3 az',
    body: 'Body Body Body 3! ur',
    published: true,
    author: 'u2'
  }, {
    id: 'p3',
    title: 'Title 2 vs',
    body: 'Body Body Body 2! wa',
    published: false,
    author: 'u3'
  }
];

const comments = [
  {
    id: 'c1',
    text: 'azerty qsdfgh wxcvbn',
    post: 'p1',
    author: 'u2'
  }, {
    id: 'c2',
    text: 'azerty tyuio qsdfgh',
    post: 'p2',
    author: 'u3'
  }, {
    id: 'c3',
    text: 'azerty erty dfghbn, jhkrty qsdfghw',
    post: 'p3',
    author: 'u1'
  }, {
    id: 'c4',
    text: 'aze the blue chip on the top of the mountain rty qsdf cvbn gh',
    post: 'p2',
    author: 'u1'
  }
];

const db = { users, posts, comments };

export { db as default };
