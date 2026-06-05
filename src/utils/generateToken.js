import jwt from 'jsonwebtoken';

const generateToken = async (id, res) => {
  const payload = {
    id: id
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '7d'});

  res.cookie('jwt', token, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === 'production', // Ensures the cookie is only sent over HTTPS in production
    sameSite: 'strict', // Prevents the cookie from being sent with cross-site requests
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return token;
}

export {
  generateToken
}