import 'cross-fetch/polyfill';
import { prisma } from '../../../src/prisma';

import { getClient } from '../../util/getClient';
import { seed, testPosts, userOne, userTwo } from '../../util/seed';
import {
  createPostMutation,
  deletePostMutation,
  updatePostMutation
} from './mutations';
import { myPostsQuery, postsQuery } from './queries';

const client = getClient();

describe('Post', () => {
  beforeEach(seed);

  it('Should return public posts', async () => {
    const {
      data: { posts }
    } = await client.query({ postsQuery });

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
    const variables = {
      data: { body: 'My new booody' },
      id: testPosts.posts[0].id
    };

    const {
      data: { updatePost }
    } = await authClient.mutate({
      mutation: updatePostMutation,
      variables
    });

    const exists = await prisma.exists.Post({
      id: variables.id,
      body: variables.data.body,
      author: { id: userOne.user.id }
    });

    expect(exists).toBe(true);
    expect(updatePost.id).toEqual(variables.id);
    expect(updatePost.body).toEqual(variables.data.body);
  });

  it('should not update other people posts', async () => {
    const authClient = getClient(userTwo.jwt);
    await expect(
      authClient.mutate({
        mutation: updatePostMutation,
        variables: {
          id: testPosts.posts[0].id,
          data: { body: 'Body' }
        }
      })
    ).rejects.toThrow();
  });

  it('should fail to update post without auth', async () => {
    await expect(
      client.mutate({
        mutation: updatePostMutation,
        variables: {
          id: testPosts.posts[0].id,
          data: { body: 'Body' }
        }
      })
    ).rejects.toThrow();
  });

  it('should create a post', async () => {
    const authClient = getClient(userTwo.jwt);
    const variables = {
      data: {
        body: `Body ${new Date()}`,
        title: `Title ${new Date()}`,
        published: true
      }
    };
    const {
      data: { createPost }
    } = await authClient.mutate({
      mutation: createPostMutation,
      variables
    });

    const exists = await prisma.exists.Post({
      body: variables.data.body,
      title: variables.data.title,
      author: { id: userTwo.user.id }
    });

    expect(exists).toBe(true);
    expect(createPost.title).toEqual(variables.data.title);
    expect(createPost.body).toEqual(variables.data.body);
  });

  it('should fail to create a post without auth', async () => {
    const variables = {
      data: {
        body: `Body ${new Date()}`,
        title: `Title ${new Date()}`,
        published: true
      }
    };
    await expect(
      client.mutate({
        mutation: createPostMutation,
        variables
      })
    ).rejects.toThrow();
  });

  it('should delete own post', async () => {
    const authClient = getClient(userOne.jwt);
    const postId = testPosts.posts[0].id;

    const {
      data: { deletePost }
    } = await authClient.mutate({
      mutation: deletePostMutation,
      variables: { id: testPosts.posts[0].id }
    });

    const exists = await prisma.exists.Post({ id: postId });

    expect(exists).toBe(false);
  });

  it('should fail to delete post by another user', async () => {
    const authClient = getClient(userTwo.jwt);
    await expect(
      authClient.mutate({
        mutation: deletePostMutation,
        variables: { id: testPosts.posts[0].id }
      })
    ).rejects.toThrow();
  });

  it('should fail to delete post without auth', async () => {
    const postId = testPosts.posts[0].id;
    await expect(
      client.mutate({
        mutation: deletePostMutation,
        variables: { id: testPosts.posts[0].id }
      })
    ).rejects.toThrow();
  });
});
