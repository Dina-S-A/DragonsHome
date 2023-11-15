const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');


const orderSchema = new mongoose.Schema({
    userId: {
        type: ObjectId
    },

    name: {
     type: String      
    },
  
    email: {
        type: String        
      },
      
      carttotal: {
        type: Number
      },
      cart: [{
        courseId: ObjectId,
        courseName: String, 
        courseImg: String, 
        coursePrice: Number, 
        quantity: Number}]        
      
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;