const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, // remove space of user input(email addrress in this case)
    unique: 1, // restrict using same email
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    // validation
    type: String,
  },
  tokenExp: {
    // token expiary date
    type: Number,
  },
});

userSchema.pre('save', function (next) {
  var user = this;
  if (user.isModified('password')) {
    // Encrypt password
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  // plainPassword: 1234567  Encrypted password in DB: $2b$10$kNSNhNfqR4a58WRj94CmC.VK0u3CvZl5OxMsKKs7oVbwSwOWzLTTa
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  // Generate token with jsonwebtoken
  var token = jwt.sign(user._id.toHexString(), 'secretToken');
  // user._id + 'secretToken' = token
  // ->
  // 'secretToken' -> user._id 토큰을 넣으면 이 사람이 어떤 user인지 알 수 있음

  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  // Decode token
  jwt.verify(token, 'secretToken', function (err, decoded) {
    // Firstly, Find user with user id
    // Verify whether token stored in DB and token from client are matched afterwards

    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model('User', userSchema);

module.exports = {
  User,
}; // export to use other files
