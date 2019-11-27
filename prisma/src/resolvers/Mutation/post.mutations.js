import { getUserId } from "../../utils";

export const createPost = (parent, { data: { title, body, published } }, { prisma, request }, info) => {
  const userId = getUserId(request);
  const data = { title, body, published, author: { connect: { id: userId } } };
  return prisma.mutation.createPost({ data }, info);
};

export const updatePost = async (_, { id, data }, { prisma, request }, info) => {
  const userId = getUserId(request);
  const postExists = await prisma.exists.Post({ id, author: { id: userId } });

  if (!postExists) {
    throw new Error('Post not found');
  }

  return prisma.mutation.updatePost({ data, where: { id } }, info);
};

export const deletePost = async (parent, { id }, { prisma, request }, info) => {
  const userId = getUserId(request);
  const postExists = await prisma.exists.Post({ id, author: { id: userId } });

  if (!postExists) {
    throw new Error('Post not found');
  }

  return prisma.mutation.deleteUser({ where: { id } }, info);
};
