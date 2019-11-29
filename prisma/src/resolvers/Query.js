import { getUserId } from '../utils/getUserId';

const buildQuery = query =>
  (query && {
    OR: [{ title_contains: query }, { body_contains: query }]
  }) ||
  {};

export const Query = {
  me(_, args, { prisma, request }, info) {
    const id = getUserId(request);
    return prisma.query.user({ where: { id } });
  },
  users(parent, { query, first, skip, after }, { prisma }, info) {
    const where = query && {
      first,
      skip,
      after,
      where: { OR: [{ name_contains: query }] }
    };
    const opArgs = { ...(where || {}) };
    return prisma.query.users(opArgs, info);
  },
  myPosts(
    _,
    { query, first, skip, after },
    { prisma, request },
    info
  ) {
    const id = getUserId(request);

    const opArgs = {
      first,
      skip,
      after,
      where: { author: { id }, ...buildQuery(query) }
    };

    return prisma.query.posts(opArgs, info);
  },
  posts(parent, { query, first, skip, after }, { prisma }, info) {
    const opArgs = {
      first,
      skip,
      after,
      where: {
        published: true,
        ...buildQuery(query)
      }
    };
    return prisma.query.posts(opArgs, info);
  },
  async post(parent, { id }, { prisma, request }, info) {
    const userId = getUserId(request, false);

    const [post] = await prisma.query.posts({
      where: {
        id,
        OR: [{ published: true }, { author: { id: userId } }]
      }
    });

    if (!post) {
      throw new Error('Post not found');
    }

    return post;
  },
  comments(parent, { query, first, skip, after }, { prisma }, info) {
    const where = query && {
      first,
      skip,
      after,
      where: { text_contains: query }
    };
    const opArgs = { ...(where || {}) };
    return prisma.query.comments(opArgs, info);
  }
};
