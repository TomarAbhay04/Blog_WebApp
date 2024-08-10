import passport from 'passport';

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).send('You need to log in first');
  }
};

export default isAuthenticated;
