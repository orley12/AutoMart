const loggedIn = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (token) {
    const err = new Error('You are already logged in');
    err.status = 403;
    next(err);
  } else {
    next();
  }
};

module.exports.loggedIn = loggedIn;
