const express = require('express');
const coursesController = require('../controllers/coursesControllers')


const router = express.Router();
 
   
 
 //Courses Pages 
 router.get ('/add' , coursesController.course_create_get);

 //getting all courses list
 router.get ('/coursesIndex' , coursesController.courses_index );
 
 // Adding 1 course to DB
 router.post('/add', coursesController.course_create_post);
 

 //Getting one course details and send it to Course Details page
 router.get('/:id',  coursesController.course_details);

 //Updating course details
 //Getting the page of updating course inputs
 router.get('/updateCourseGet/:id', coursesController.course_update_getpage);

 //Sending the updates to DB
 router.post('/updateCourse/:id', coursesController.course_update_post);
 
 //Deleting one course
 router.delete('/:id', coursesController.course_delete);

 

  module.exports = router;