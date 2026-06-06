import bcrypt from 'bcryptjs';
import {prisma} from '../configs/database.js';
import {generateToken} from '../utils/generateToken.js';

const register = async (req, res) => {
  const {name, email, password} = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ // 400 Bad Request
      message: 'Name, email, and password are required.'
    });
  }

  // Check if user with the same email already exists
  const existingUser = await prisma.user.findUnique({
    where: {email}
  });

  if (existingUser) {
    return res.status(400).json({ // 400 Bad Request
      message: 'User already exists with this email.'
    });
  }

  // Hash the password before storing it on the database
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  });

  const token = await generateToken(newUser.id, res);

  res.status(201).json({ // 201 Created
    message: 'User registered successfully.',
    data: {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      },
      token
    }
  });
}

const login = async (req, res) => {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json({ // 400 Bad Request
      message: 'Email and password are required.'
    });
  }

  // Check if user with the provided email exists
  const user = await prisma.user.findUnique({
    where: {email: email}
  });

  if (!user) {
    return res.status(401).json({ // 401 Unauthorized
      message: 'Invalid email or password.'
    });
  }

  // Compare the provided password with the stored hashed password
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return res.status(401).json({ // 401 Unauthorized
      message: 'Invalid email or password.'
    });
  }

  const token = await generateToken(user.id, res);

  res.status(200).json({ // 200 OK
    message: 'Login successful.',
    data: {
      id: user.id,
      name: user.name,
      email: user.email
    },
    token
  });
}

const logout = async (req, res) => {
  res.clearCookie('jwt', '', {
    expires: new Date(0),
    httpOnly: true
  });

  res.status(200).json({ // 200 OK
    message: 'Logout successful.'
  });
}

export {
  register,
  login,
  logout,
};