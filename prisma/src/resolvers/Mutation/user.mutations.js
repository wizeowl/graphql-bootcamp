import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const createUser = async (parent, { data }, { prisma }, info) => {
  const { password } = data;
  if (password.length < 8) {
    throw new Error('Password must be 8 chars long you idiot');
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.mutation
    .createUser({ data: { ...data, password: hashedPassword } });

  return { user, token: jwt.sign({ userId: user.id }, 'mysecretniaaaahahahaha') };
};

export const updateUser = (parent, { id, data }, { prisma }, info) => {
  return prisma.mutation.updateUser({ data, where: { id } }, info);
};

export const deleteUser = (parent, { id }, { prisma }, info) => {
  return prisma.mutation.deleteUser({ where: { id } }, info);
};
