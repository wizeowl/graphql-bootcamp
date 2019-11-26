export const createPost = (parent, { data: { title, body, published, author } }, { prisma }, info) => {
  const data = { title, body, published, author: { connect: { id: author } } };
  return prisma.mutation.createPost({ data }, info);
};

export const updatePost = (parent, { id, data }, { prisma }, info) => {
  return prisma.mutation.updatePost({ data, where: { id } }, info);
};

export const deletePost = (parent, { id }, { prisma }, info) => {
  return prisma.mutation.deleteUser({ where: { id } }, info);
};
