import bcrypt from 'bcryptjs';

import { generateToken } from '../../utils/generateToken';
import { getUserId } from '../../utils/getUserId';
import { validateAndHashPassword } from '../../utils/validateAndHashPassword';

export const createUser = async (
  parent,
  { data },
  { prisma },
  info
) => {
  const password = validateAndHashPassword(data.password);

  const user = await prisma.mutation.createUser({
    data: { ...data, password }
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
  const password = validateAndHashPassword(data.password);

  return prisma.mutation.updateUser(
    { data: { ...data, password }, where: { id } },
    info
  );
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
