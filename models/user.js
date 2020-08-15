const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true, // remove space of user input(email addrress in this case)
    unique: 1 // restrict using same email
  },
  password: {
    type: String,
    minlength: 5
  },
  lastname: {
    type: String,
    maxlength: 50
  },
  role: {
    type: Number,
    default: 0
  },
  image: String,
  token: { // validation 
    type: String
  },
  tokenExp: { // token expiary date
    type: Number
  }
})

const User = mongoose.model('User', userSchema)

module.exports = {
  User
} // 다른 파일에서도 쓸 수 있도록 export