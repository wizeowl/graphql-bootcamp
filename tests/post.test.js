import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import { prisma } from '../src/prisma';

import { getClient } from './util/getClient';
import { seed, testPosts, userOne, userTwo } from './util/seed';

const client = getClient();

describe('Post', () => {
  beforeEach(seed);

  const myPostsQuery = gql`
    query {
      myPosts {
        id
        title
        body
        published
        author {
          id
          name
        }
      }
    }
  `;

  const updatePostMutation = (postId, body) => gql`
    mutation {
      updatePost(id: "${postId}", data: { body: "${body}" }) {
        id
        title
        body
      }
    }
  `;

  const createPostMutation = (title, body, published) => gql`
    mutation {
      createPost(data: {title: "${title}" body: "${body}" published: ${published}}) {
        id title body published author { id }
      }
    }
  `;

  const deletePostMutation = postId => gql`
    mutation {
      deletePost(id: "${postId}") {
        id
      }
    }
  `;

  it('Should return public posts', async () => {
    const query = gql`
      query {
        posts {
          id
          title
          body
          published
        }
      }
    `;

    const {
      data: { posts }
    } = await client.query({ query });

    expect(posts).toBeTruthy();
    expect(posts.length).toEqual(1);
    const [post] = posts;
    expect(post.published).toBeTruthy();
  });

  it('should fail to get my posts without auth', async () => {
    await expect(
      client.query({ query: myPostsQuery })
    ).rejects.toThrow();
  });

  it('should get myPosts', async () => {
    const authClient = getClient(userOne.jwt);

    const {
      data: { myPosts }
    } = await authClient.query({ query: myPostsQuery });

    myPosts.forEach(post => {
      expect(post.id).toBeTruthy();
      expect(post.title).toBeTruthy();
      expect(post.body).toBeTruthy();
      expect(post.published).toBeDefined();
      expect(post.author.id).toEqual(userOne.user.id);
    });
  });

  it('should update own post', async () => {
    const authClient = getClient(userOne.jwt);
    const postId = testPosts.posts[0].id;
    const body = 'My new booody';

    const {
      data: { updatePost }
    } = await authClient.mutate({
      mutation: updatePostMutation(postId, body)
    });

    const exists = await prisma.exists.Post({
      id: postId,
      body,
      author: { id: userOne.user.id }
    });

    expect(exists).toBe(true);
    expect(updatePost.id).toEqual(postId);
    expect(updatePost.body).toEqual(body);
  });

  it('should not update other people posts', async () => {
    const authClient = getClient(userTwo.jwt);
    const postId = testPosts.posts[0].id;
    await expect(
      authClient.mutate({ mutation: updatePostMutation(postId, '') })
    ).rejects.toThrow();
  });

  it('should fail to update post without auth', async () => {
    const postId = testPosts.posts[0].id;
    await expect(
      client.mutate({ mutation: updatePostMutation(postId, '') })
    ).rejects.toThrow();
  });

  it('should create a post', async () => {
    const authClient = getClient(userTwo.jwt);
    const body = `Body ${new Date()}`;
    const title = `Title ${new Date()}`;
    const {
      data: { createPost }
    } = await authClient.mutate({
      mutation: createPostMutation(title, body, true)
    });

    const exists = await prisma.exists.Post({
      body,
      title,
      author: { id: userTwo.user.id }
    });

    expect(exists).toBe(true);
    expect(createPost.title).toEqual(title);
    expect(createPost.body).toEqual(body);
  });

  it('should fail to create a post without auth', async () => {
    await expect(
      client.mutate({
        mutation: createPostMutation('Title', 'Body', true)
      })
    ).rejects.toThrow();
  });

  it.only('should delete own post', async () => {
    const authClient = getClient(userOne.jwt);
    const postId = testPosts.posts[0].id;

    const {
      data: { deletePost }
    } = await authClient.mutate({
      mutation: deletePostMutation(postId)
    });

    const exists = await prisma.exists.Post({ id: postId });

    expect(exists).toBe(false);
  });

  it('should fail to delete post by another user', async () => {
    const authClient = getClient(userTwo.jwt);
    const postId = testPosts.posts[0].id;
    await expect(
      authClient.mutate({ mutation: deletePostMutation(postId) })
    ).rejects.toThrow();
  });

  it('should fail to delete post without auth', async () => {
    const postId = testPosts.posts[0].id;
    await expect(
      client.mutate({ mutation: deletePostMutation(postId) })
    ).rejects.toThrow();
  });
});
