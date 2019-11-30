import jwt from 'jsonwebtoken';

export const SECRET = 'mysecretniaaaahahahaha';

export const generateToken = user => {
  jwt.sign({ userId: user.id }, SECRET, { expiresIn: '7 days' });
};
