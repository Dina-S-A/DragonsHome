const { Router } = require ('express') ;
const authController = require('../controllers/authController');
const router = Router();

//Member routes
 router.get('/memberSignup', authController.member_signup_get); 
 router.post('/memberSignup', authController.member_signup_post);
 router.get('/memberLogin', authController.member_login_get);
 router.post('/memberLogin', authController.member_login_post);

//Student routes
 router.get('/studentSignup', authController.student_signup_get); 
 router.post('/studentSignup', authController.student_signup_post);
 router.get('/studentLogin', authController.student_login_get);
 router.post('/studentLogin', authController.student_login_post);



 router.get('/logout', authController.logout_get);


 module.exports = router;
 