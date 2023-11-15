
const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require ('bcrypt');
const { ObjectId } = require('mongodb');
const memberSchema = new mongoose.Schema({

    name: {
     type: String,
     required: [true, 'Please enter your name'],   
    },
  
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
      },

      password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters'],
      },
      carttotal: {
        total: Number
      },
      cart: [{
        courseId: ObjectId,
        courseName: String, 
        courseImg: String, 
        coursePrice: Number, 
        quantity: Number}]
        
      
});


// fire this function before doc saved to db to hash password
memberSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login member
memberSchema.statics.login = async function(email, password) {
  const member = await this.findOne({ email });
  if (member) {
    const auth = await bcrypt.compare(password, member.password);
    if (auth) {
      return member;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};


const Member = mongoose.model('member', memberSchema);

module.exports = Member;