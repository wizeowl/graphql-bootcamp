import jwt from 'jsonwebtoken';
import { SECRET } from "./resolvers/Mutation/user.mutations";

export const getUserId = ({ request: { headers: { authorization } } }) => {
  if (!authorization) {
    throw new Error('Authorization required');
  }

  const token = authorization.replace('Bearer ', '');
  const { userId } = jwt.verify(token, SECRET);

  return userId;
};
