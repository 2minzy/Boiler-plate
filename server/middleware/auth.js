const { User } = require('../models/User');

let auth = (req, res, next) => {
  // Where authentication is processed
  // 1. bring token from client cookie
  let token = req.cookies.x_auth;
  // 2. Find user after decode the token
  User.findByToken(token, (err, user) => {
    if (err) thtow(err);
    if (!user) return res.json({ isAuth: false, error: true });

    req.token = token;
    req.user = user;
    next();
  });
  // 3. If you can find user, authentication is okay
  // 4. If not, authentication is fail
};

module.exports = { auth };
