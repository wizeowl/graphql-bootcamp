import { getUserId } from "../utils";

export const Query = {
  me(_, args, { prisma, request }, info) {
    const id = getUserId(request);
    return prisma.query.user({ where: { id } });
  },
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
