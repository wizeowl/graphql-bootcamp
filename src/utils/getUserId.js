import jwt from 'jsonwebtoken';
import { SECRET } from './generateToken';

export const getUserId = (
  { request, connection },
  requireAuth = true
) => {
  const authToken = request
    ? request.headers.authorization
    : connection.context.Authorization;

  if (!authToken && !requireAuth) {
    return null;
  }

  if (!authToken) {
    throw new Error('Authorization required');
  }

  const token = authToken.replace('Bearer ', '');
  const { userId } = jwt.verify(token, SECRET);

  return userId;
};
