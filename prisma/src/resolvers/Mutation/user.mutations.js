import uuidv4 from "uuid/v4";

export const createUser = (parent, { data }, { prisma }, info) => {
  return prisma.mutation.createUser({ data }, info);
};

export const updateUser = (parent, { id, data }, { prisma }, info) => {
  return prisma.mutation.updateUser({ data, where: { id } }, info);
};

export const deleteUser = (parent, { id }, { prisma }, info) => {
  return prisma.mutation.deleteUser({ where: { id } }, info);
};
