import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';

import { client, seed } from './seed/seed';

describe('Post', () => {
  beforeEach(seed);

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
});
