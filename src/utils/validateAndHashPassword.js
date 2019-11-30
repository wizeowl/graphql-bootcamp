import bcrypt from 'bcryptjs';

export const validateAndHashPassword = async password => {
  if (password.length < 8) {
    throw new Error('Password must be 8 chars long you idiot');
  }

  return await bcrypt.hash(password, 10);
};
