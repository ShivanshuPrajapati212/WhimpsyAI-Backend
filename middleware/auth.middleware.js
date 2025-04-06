const isAuthenticated = (req, res, next) => {
  console.log('User:', req.user); // Log the user object
  console.log('Session:', req.session); // Log the session object
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Unauthorized' });
};
  
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', err });
  };

module.exports = {errorHandler, isAuthenticated}