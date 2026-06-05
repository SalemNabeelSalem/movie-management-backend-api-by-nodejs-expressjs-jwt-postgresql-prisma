import bcrypt from "bcryptjs";
import {prisma} from "../configs/database.js";
import {generateToken} from "../utils/generateToken.js";

const register = async (req, res) => {
  const {name, email, password} = req.body;

  // Check if user with the same email already exists
  const existingUser = await prisma.user.findUnique({
    where: {email}
  });

  if (existingUser) {
    return res.status(400).json({message: 'User already exists with this email.'}); // 400 Bad Request
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

  const token = await generateToken(newUser);

  res.status(201).json({
    message: 'User registered successfully.',
    data: {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      },
      token
    }
  }); // 201 Created
}

const login = async (req, res) => {
  const {email, password} = req.body;

  // Check if user with the provided email exists
  const user = await prisma.user.findUnique({
    where: {email: email}
  });

  if (!user) {
    return res.status(401).json({message: 'Invalid email or password.'}); // 401 Unauthorized
  }

  // Compare the provided password with the stored hashed password
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return res.status(401).json({message: 'Invalid email or password.'}); // 401 Unauthorized
  }

  const token = await generateToken(user);

  res.status(200).json({
    message: 'Login successful.',
    data: {
      id: user.id,
      name: user.name,
      email: user.email
    },
    token
  }); // 200 OK
}

export {
  register,
  login,
};