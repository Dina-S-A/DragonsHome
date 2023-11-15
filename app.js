const express = require('express');
const morgan = require('morgan');
const { render } = require('ejs');
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');

const authRoutes = require ('./routes/authRoutes');
const coursesRoutes = require('./routes/coursesRoutes');
const studentsRoutes = require('./routes/studentsRoutes');
const cartRoutes = require('./routes/cartRoutes');


const { requireAuth, checkMember, checkStudent } = require('./middleware/authMiddleware');


//Express app
const app = express();

//Connecting to the  mongo database teacher
//const dbURI = 'mongodb+srv://dragons:Passw0rd@mongodb.ho5iekl.mongodb.net/mongodb?retryWrites=true&w=majority';
const dbURI = 'mongodb+srv://dragon:dragon1@cluster0.wozqhwt.mongodb.net/SushiWS?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
   .then((result) => app.listen(4000))//listening for request and starting the server
   .catch((err) => console.log(err));

//register view engine
app.set ('view engine', 'ejs'); //set lets us set some settings it looks into views folder for ejs files

//Middleware and static files

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
  });
app.use(express.json());
app.use(cookieParser());







//Routes
app.get('*', checkMember);// call check user for every get request
app.get('*', checkStudent);// call check user for every get request
app.post('*', checkMember);// call check user for every get request
app.post('*', checkStudent);// call check user for every get request



//Home page
app.get ('/' , (req, res) => {
    res.render('index' , { title : 'Home'}); 
});        




//all courses routes
app.use('/courses',coursesRoutes);

//all students routes
app.use('/students',studentsRoutes);

//all cart routes
app.use('/cart',cartRoutes);


app.use(authRoutes); // that should be here after the checkTeacher is called 


 // 404 page
 app.use((req, res) => {    
   res.status(404).render('404' , { title : '404'}); 
});
