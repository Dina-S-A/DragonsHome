const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require ('bcrypt');
const { ObjectId } = require('mongodb');
const studentSchema = new mongoose.Schema({

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
      schedule: [{courseId: ObjectId,
                   courseName: String, 
                   courseDescription: String, 
                   courseSubArea: String, 
                   courseCredit: Number}]
      
});


// fire this function before doc saved to db to hash password
studentSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login student
studentSchema.statics.login = async function(email, password) {
  const student = await this.findOne({ email });
  if (student) {
    const auth = await bcrypt.compare(password, student.password);
    if (auth) {
      return student;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};


const Student = mongoose.model('student', studentSchema);

module.exports = Student;