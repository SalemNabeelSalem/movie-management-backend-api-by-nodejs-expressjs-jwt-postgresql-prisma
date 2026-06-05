import jwt from 'jsonwebtoken';

const generateToken = async (user) => {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '7d'});
}

export {
  generateToken
}