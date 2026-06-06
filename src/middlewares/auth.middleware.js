import jwt from 'jsonwebtoken';
import {prisma} from '../configs/database.js';

const authMiddleware = async (req, res, next) => {
  let token = null;

  const authHeader = req.headers['authorization'];

  // 1. Try to get token from Authorization header
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  // 2. Fallback: Try to get token from cookies if header wasn't used
  else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  // 3. If no token is found anywhere, deny access
  if (!token) {
    return res.status(401).json({ // 401 Unauthorized
      message: 'No token provided, authorization denied.'
    });
  }

  try {
    // 4. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Fetch user (excluding sensitive fields like password)
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        // add other fields you actually need, but skip password
      }
    });

    if (!user) {
      return res.status(401).json({ // 401 Unauthorized
        message: 'User not found or account deactivated.'
      });
    }

    // 6. Attach the user to the request object, so it can be accessed in the next middleware or route handler
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Optional: Handle expired tokens explicitly for a better frontend UX
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({  // 401 Unauthorized
        message: 'Token has expired'
      });
    }

    return res.status(401).json({  // 401 Unauthorized
      message: 'Invalid token'
    });
  }
}

export {
  authMiddleware
}