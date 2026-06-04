const register = async (req, res) => {
  const {username, password} = req.body;

  // Here you would typically add logic to save the user to a database
  // For this example, we'll just return a success message

  res.status(201).json({message: 'User registered successfully', user: {username}});
}

export {
  register
};