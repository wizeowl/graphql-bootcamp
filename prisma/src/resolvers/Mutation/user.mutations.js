import bcrypt from 'bcryptjs';

import { generateToken } from '../../utils/generateToken';
import { getUserId } from '../../utils/getUserId';

export const createUser = async (_, { data }, { prisma }, info) => {
  const { password } = data;
  if (password.length < 8) {
    throw new Error('Password must be 8 chars long you idiot');
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.mutation.createUser({
    data: { ...data, password: hashedPassword }
  });

  return { user, token: generateToken(user) };
};

export const updateUser = (
  _,
  { data },
  { prisma, request },
  info
) => {
  const id = getUserId(request);
  return prisma.mutation.updateUser({ data, where: { id } }, info);
};

export const deleteUser = (_, args, { prisma, request }, info) => {
  const id = getUserId(request);
  return prisma.mutation.deleteUser({ where: { id } }, info);
};

export const login = async (
  parent,
  { data: { email, password } },
  { prisma },
  info
) => {
  const user = await prisma.query.user({ where: { email } });

  if (!user) {
    throw new Error('User not found');
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw new Error('User not found');
  }

  return { user, token: generateToken(user) };
};
