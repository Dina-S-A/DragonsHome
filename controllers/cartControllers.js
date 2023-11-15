const Student = require('../models/Student');
const Member = require('../models/Member');
const Course = require('../models/course');
const Order = require('../models/order');





// getting all menu items to menu page teacher member
const menu =(req, res) => { 
  Course.find().sort({ createdAt:1 })
     .then((result) => {
        res.render('menu', { title: 'Menu', courses: result })//geting all menu details and send result to menu page
     })
     .catch((err) => {
        console.log(err);
     }); 
};

//Getting one menu item details
const menu_item_details = (req, res) => {   
  const id = req.params.id;    
  Course.findById(id)
   .then(result => {
     res.render('menuItemDetails', { course: result, title: 'Menu Item Details' });
   })
   .catch(err => {
     console.log(err);
   });
};

////////////TRIAL WITH ASYNC FUNCTION TRIAL TO  UDATE CART THEN ADD TO CART/////////////////////////////////////////////////////////////////////////////////////
const course_addTocart_post = async  (req, res) => {  
  
  const course = req.body
  try{
      //first query
      let remove_item = await Member.updateOne({ _id:  course.memberId  },{ $pull: { cart: {courseId:course.courseId} } });     
      

      //second query
      let add_item = await Member.updateOne(
        {_id: course.memberId },
       {
         $push: {cart:
            [{ courseId: course.courseId,
              courseName: course.name, 
              courseImg:course.subArea,
              coursePrice: course.credits, 
              quantity: course.quantity
              }]}
       })      

      res.redirect('/cart/showCart/'+course.memberId);  

     
  }    catch(err){
    return res.status(400).json({err})
}
 
 }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //controller to show member cart
 const  student_showCart_get = (req, res) => {  
  const id = req.params.id;   
  Member.findById(id)
   .then(result => {
     res.render('./cart', { cartDetails: result, title: 'Cart Details' });
     //console.log(result)
   })
   .catch(err => {
     console.log(err);
   });
};

//Deleting one item from cart
const course_in_cart_delete = (req, res) => {
  console.log(req.params);
   const id = req.params.id;
   
   Member.updateOne({ _id: id },{ $pull: { cart: {courseId:req.body.courseId} } }) 
   
   .then((result) => {    
    res.redirect('/cart/showCart/'+id);
 })
     .catch(err => {
       console.log(err);
     });
 }


//Submitting new order
const order_post = async  (req, res) => {  
  
  const course = req.body
  const id = req.params.id;  
  
  try{
      //first query
      let userPlacedOrder = await  Member.findById(id);
      
      //second query       
      // Create a new instance of the Order model
      const order = new Order({
        userId: userPlacedOrder._id,
        name: userPlacedOrder.name,
        email: userPlacedOrder.email,
        carttotal: course.carttotal,
        cart: userPlacedOrder.cart
    });

    // Save the new order to the database
    let done = await order.save();
    //console.log(done);

    //third query empty cart
    await Member.updateOne(
      { _id: id },
      { $set: { cart: [] } }
  );


    res.render('order', { orderDetails: done, title: 'Order' });
} catch (err) {
    return res.status(400).json({ err });
}
};


 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
  module.exports={
   menu,
   menu_item_details,
   course_addTocart_post,
   student_showCart_get,
   course_in_cart_delete,
   order_post
  }

    