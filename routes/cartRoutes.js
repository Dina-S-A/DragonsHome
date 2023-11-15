const express = require('express');
const cartController = require('../controllers/cartControllers');
const coursesController = require('../controllers/coursesControllers');


const router = express.Router();


//getting all courses list
router.get ('/menu' , cartController.menu );

//Getting one menu item details and send it to menu item Details page
router.get('/:id',  cartController.menu_item_details);


//Add items to cart 
router.post('/addToCart', cartController.course_addTocart_post);


//Member retrieving his cart
router.get('/showCart/:id', cartController.student_showCart_get);
 

 //Deleting one menu item from cart
 router.post('/deleteFromCart/:id', cartController.course_in_cart_delete); 

// Adding 1 order to DB
router.post('/submitOrder/:id', cartController.order_post);

//Showing order page
//router.get('/order', cartController.student_showCart_get);


  module.exports = router;