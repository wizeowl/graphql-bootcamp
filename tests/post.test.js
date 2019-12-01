import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';

import { getClient } from './util/getClient';
import { seed, userOne } from './util/seed';

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
});
