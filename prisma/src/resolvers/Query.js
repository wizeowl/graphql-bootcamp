export const Query = {
  users(parent, { query }, { prisma }, info) {
    const where = query && {
      where: { OR: [{ name_contains: query }, { email_contains: query }] }
    };
    const opArgs = { ...(where || {}) };
    return prisma.query.users(opArgs, info);
  },
  posts(parent, { query }, { prisma }, info) {
    const where = query && {
      where: { OR: [{ title_contains: query }, { body_contains: query }] }
    };
    const opArgs = { ...(where || {}) };
    return prisma.query.posts(opArgs, info);
  },
  comments(parent, { query }, { prisma }, info) {
    const where = query && {
      where: { text_contains: query }
    };
    const opArgs = { ...(where || {}) };
    return prisma.query.comments(opArgs, info);
  }
};
