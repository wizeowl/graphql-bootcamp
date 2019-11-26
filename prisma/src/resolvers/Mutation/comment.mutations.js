export const createComment = (parent, { data: { text, post, author } }, { prisma }, info) => {
  const data = { text, author: { connect: { id: author } }, post: { connect: { id: post } } };
  return prisma.mutation.createComment({ data }, info);
};

export const updateComment = (parent, { id, data }, { prisma }, info) => {
  return prisma.mutation.updateComment({ data, where: { id } }, info);
};

export const deleteComment = (parent, { id }, { prisma }, info) => {
  return prisma.mutation.deleteComment({ where: { id } }, info);
};
