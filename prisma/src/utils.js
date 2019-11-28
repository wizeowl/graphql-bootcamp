import jwt from 'jsonwebtoken';
import { SECRET } from "./resolvers/Mutation/user.mutations";

export const getUserId = ({ request, connection }, requireAuth = true) => {
  const authToken = request
    ? request.headers.authorization
    : connection.context.Authorization;

  if (!authToken && !requireAuth) {
    return null;
  }

  if (!authToken) {
    throw new Error('Authorization required');
  }

  const token = authorization.replace('Bearer ', '');
  const { userId } = jwt.verify(token, SECRET);

  return userId;
};
