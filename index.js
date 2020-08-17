const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require('./models/User');

// application/x--www-form-urlencoded 을 분석해서 가져오기 위해서
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// application/json 을 분석해서 가져오기 위해서
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
const { urlencoded } = require('body-parser');
mongoose
  .connect(config.mongoURI, {
    // to avoid error
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MonjoDB Connected...'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World! Have a good day');
});

app.post('/api/users/register', (req, res) => {
  // 회원 가입 할 때 필요한 정보들을 client에서 가져오면
  // 그것들을 DB에 넣어준다.

  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.post('/api/users/login', (req, res) => {
  // 1. Find requested email in DB
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message:
          'The email you entered is invalid. Please check your email and try again.',
      });
    }
    // 2. If there is requested email in DB, check out if it's correct email
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message:
            'The password you entered is invalid. Please check your password and try again.',
        });
      // 3. When password is also correct, generate token
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        // Save token to cookie or local storage, Session
        res
          .cookie('x_auth', user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

// on this case, role = 0 -> normal user, role != 0 -> admin
// you can customize this e.g. role 1 = admin role 2 = specific department admin
app.get('/api/users/auth', auth, (req, res) => {
  // after went through auth, Authentication is true
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
