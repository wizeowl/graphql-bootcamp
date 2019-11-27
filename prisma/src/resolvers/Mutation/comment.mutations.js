import { getUserId } from "../../utils";

export const createComment = (parent, { data: { text, post } }, { prisma, request }, info) => {
  const author = getUserId(request);

  const data = { text, author: { connect: { id: author } }, post: { connect: { id: post } } };
  return prisma.mutation.createComment({ data }, info);
};

export const updateComment = async (parent, { id, data }, { prisma, request }, info) => {
  const userId = getUserId(request);

  const commentExists = await prisma.exists.Comment({ id, author: { id: userId } });
  if (!commentExists) {
    throw new Error('Comment not found');
  }

  return prisma.mutation.updateComment({ data, where: { id } }, info);
};

export const deleteComment = async (parent, { id }, { prisma, request }, info) => {
  const userId = getUserId(request);

  const commentExists = await prisma.exists.Comment({ id, author: { id: userId } });
  if (!commentExists) {
    throw new Error('Comment not found');
  }

  return prisma.mutation.deleteComment({ where: { id } }, info);
};
