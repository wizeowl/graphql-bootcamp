import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET = 'mysecretniaaaahahahaha';

export const createUser = async (parent, { data }, { prisma }, info) => {
  const { password } = data;
  if (password.length < 8) {
    throw new Error('Password must be 8 chars long you idiot');
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.mutation
    .createUser({ data: { ...data, password: hashedPassword } });

  return { user, token: jwt.sign({ userId: user.id }, SECRET) };
};

export const updateUser = (parent, { id, data }, { prisma }, info) => {
  return prisma.mutation.updateUser({ data, where: { id } }, info);
};

export const deleteUser = (parent, { id }, { prisma }, info) => {
  return prisma.mutation.deleteUser({ where: { id } }, info);
};

export const login = async (parent, { data: { email, password } }, { prisma }, info) => {
  const user = await prisma.query.user({ where: { email } });

  if (!user) {
    throw new Error('User not found');
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw new Error('User not found');
  }

  return { user, token: jwt.sign({ userId: user.id }, SECRET) };
};
