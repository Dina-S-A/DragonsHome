const Member = require("../models/Member");
const Student = require("../models/Student");
const jwt = require('jsonwebtoken');
const sjwt = require('jsonwebtoken'); // sjwt, student token

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('member validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createMemberToken = (id) => {
  return jwt.sign({ id }, 'dragons secret', {
    expiresIn: maxAge
  });
};

const createStudentToken = (id) => {
  return sjwt.sign({ id }, 'dragons secret', {
    expiresIn: maxAge
  });
};

// controller actions 

//Member controlllers
module.exports.member_signup_get = (req, res) => {
  res.render('memberSignup', { title : 'Member Sign up'});
}

module.exports.member_login_get = (req, res) => {
  res.render('memberLogin', { title : 'log in'});
}

module.exports.member_signup_post = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const member = await Member.create({ name, email, password });
    const token = createMemberToken(member._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ member: member._id });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
 
}


module.exports.member_login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const member = await Member.login(email, password);
    const token = createMemberToken(member._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ member: member._id });
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}

//Student controllers
module.exports.student_signup_get = (req, res) => {
  res.render('studentSignup', { title : 'Student Sign up'});
}

module.exports.student_login_get = (req, res) => {
  res.render('studentLogin', { title : 'log in'});
}

module.exports.student_signup_post = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const student = await Student.create({ name, email, password });
    const token = createStudentToken(student._id);
    res.cookie('sjwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ student: student._id });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
 
}


module.exports.student_login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await Student.login(email, password);
    const token = createStudentToken(student._id);
    res.cookie('sjwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ student: student._id });
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}



//Log out controller for all users
module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.cookie('sjwt', '', { maxAge: 1 });
  res.redirect('/');
}