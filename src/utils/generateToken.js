import jwt from 'jsonwebtoken';

export const generateToken = user =>
  jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '7 days'
  });
