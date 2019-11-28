import { getUserId } from "../../utils";

export const createComment = async (parent, { data: { text, post } }, { prisma, request }, info) => {
  const author = getUserId(request);
  const postExists = await prisma.exists.Post({ id: post, published: true });
  if (!postExists) {
    throw new Error('Post not found');
  }

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
