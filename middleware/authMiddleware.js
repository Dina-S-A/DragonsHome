const jwt = require('jsonwebtoken');
const sjwt = require('jsonwebtoken');
const Member = require('../models/Member');
const Student = require('../models/Student');

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified Teacher
  if (token) {
    jwt.verify(token, 'dragons secret', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};



// check current Member
const checkMember = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, 'dragons secret', async (err, decodedToken) => {
        if (err) {
          res.locals.member = null;
          next();
        } else {
          let member = await Member.findById(decodedToken.id);
          res.locals.member = member;// here we made the member object saved and available in locals for every view
         // console.log(res.locals.member);
          next();
        }
      });
    } else {
      res.locals.member = null;
      next();
    }
  };

  // check current student
const checkStudent = (req, res, next) => {
  const token = req.cookies.sjwt;
  if (token) {
    sjwt.verify(token, 'dragons secret', async (err, decodedToken) => {
      if (err) {
        res.locals.student = null;
        next();
      } else {
        let student = await Student.findById(decodedToken.id);
        res.locals.student = student;// here we made the student object saved and available in locals for every view
       // console.log(res.locals.student);
        next();
      }
    });
  } else {
    res.locals.student = null;
    next();
  }
};

module.exports = { requireAuth, checkMember, checkStudent };