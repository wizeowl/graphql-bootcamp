import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

const typeDefs = `
  type Query {
    post: Post
    me: User!
    users(query: String): [User]
    posts(query: String): [Post]
    comments(query: String): [Comment]
  }
  
  type Mutation {
    createUser(data: CreateUserInput): User!
    deleteUser(id: ID!): User!
    createPost(data: CreatePostInput): Post!
    deletePost(id: ID!): Post!
    createComment(data: CreateCommentInput): Comment!
  }
  
  input CreateUserInput {
    name: String!, email: String!, age: Int
  }
  
  input CreatePostInput {
    title: String!, body: String, published: Boolean, author: ID!
  }
  
  input CreateCommentInput {
    text: String!, post: ID!, author: ID!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int,
    posts: [Post!]!
    comments: [Comment!]!
  }
  
  type Comment {
    id: ID!
    text: String!
    post: Post!
    author: User!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }
`;

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

let posts = [
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

let comments = [
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

const resolvers = {
  Query: {
    me() {
      return users[0];
    },
    users(parent, { query }, ctx, info) {
      if (query) {
        return users.filter(user => user.name.toLowerCase().includes(query.toLowerCase()));
      }
      return users;
    },
    post() {
      return posts[0];
    },
    posts(parent, { query }, ctx, info) {
      if (query) {
        return posts.filter(post =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.body.toLowerCase().includes(query.toLowerCase())
        );
      }
      return posts;
    },
    comments(parent, { query }, ctx, info) {
      if (query) {
        return comments.filter(comment => comment.text === query);
      }
      return comments;
    }
  },
  Post: {
    author({ author }, args, ctx, info) {
      return users.find(user => user.id === author);
    },
    comments({ id }, args, ctx, info) {
      return comments.filter(comment => comment.post === id);
    }
  },
  User: {
    posts({ id }, args, ctx, info) {
      return posts.filter(post => post.author === id);
    },
    comments({ id }, args, ctx, info) {

      return comments.filter(comment => comment.author === id);
    }
  },
  Comment: {
    post({ post }, args, ctx, info) {
      return posts.find(p => p.id === post);
    },
    author({ author }, args, ctx, info) {
      return users.find(user => user.id === author);
    }
  },
  Mutation: {
    createUser(parent, { data }, ctx, info) {
      const emailTaken = users.some(u => u.email === data.email);
      if (emailTaken) {
        throw new Error('Email taken');
      }

      const id = `uu${users.length}`;
      const user = { id, ...data };
      users.push(user);
      return user;
    },
    deleteUser(parent, { id }, ctx, info) {
      const userIndex = users.findIndex(u => u.id === id);
      if (userIndex < 0) {
        throw new Error('User does not Exist');
      }

      const [user] = users.splice(userIndex, 1);
      posts = posts.filter(p => {
        const match = p.author === id;

        if (match) {
          comments = comments.filter(c => c.post === p.id);
        }

        return !match;
      });
      comments = comments.filter(c => c.author !== id);

      return user;
    },
    createPost(parent, { data }, ctx, info) {
      const userExists = users.some(u => u.id === data.author);
      if (!userExists) {
        throw new Error('User does not Exist');
      }

      const id = `pp${posts.length}`;
      const post = { id, ...data };
      posts.push(post);
      return post;
    },
    deletePost(parent, { id }, ctx, info) {
      const postIndex = posts.findIndex(p => p.id === id);
      if (postIndex < 0) {
        throw new Error('Post does not exist');
      }

      const [post] = posts.splice(postIndex, 1);
      comments = comments.filter(c => c.post === id);

      return post;
    },
    createComment(parent, { data }, ctx, info) {
      const userExists = users.some(u => u.id === data.author);
      if (!userExists) {
        throw new Error('User does not Exist');
      }
      const postExists = posts.some(p => p.id === data.post);
      if (!postExists) {
        throw new Error('Post does not Exist');
      }

      const id = `cc${comments.length}`;
      const comment = { id, ...data };
      comments.push(comment);
      console.log(comment);
      return comment;
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => {
  console.log("server up");
});
