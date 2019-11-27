import { getUserId } from "../../utils";

export const createPost = (parent, { data: { title, body, published } }, { prisma, request }, info) => {
  const userId = getUserId(request);
  const data = { title, body, published, author: { connect: { id: userId } } };
  return prisma.mutation.createPost({ data }, info);
};

export const updatePost = (parent, { id, data }, { prisma }, info) => {
  return prisma.mutation.updatePost({ data, where: { id } }, info);
};

export const deletePost = (parent, { id }, { prisma }, info) => {
  return prisma.mutation.deleteUser({ where: { id } }, info);
};
