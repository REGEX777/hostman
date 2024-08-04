import 'dotenv/config'
// Important Imports
import express from 'express';
import ejs from 'ejs';
import multer from 'multer';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcryptjs';
import User from './models/User.js';


// Extra Imports
import colors from 'colors';

// Database Initialization

mongoose.connect(process.env.MONGO_URI)
.then(()=>{console.log(`[INFORMATION]> Succesfully connected to the database.`.green)})
.catch(err=>console.log(err))

// Session config

const sessionStore = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
})

// Route Imports
import userRoute from './routes/Home.js'
import keyDetails from './routes/keyDetails.js'
import embedEditor from './routes/embedEditor.js'
import apiControl from './routes/apiControl.js'
import postPage from './routes/postPage.js'
import loginRoute from './routes/Login.js';
import signupRoute from './routes/Signup.js';

const PORT = process.env.PORT


const app = express();
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    }
}))
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});





app.use('/', userRoute)
app.use('/apidetails', keyDetails)
app.use('/embedEditor', embedEditor)
app.use('/api', apiControl)
app.use('/post', postPage)
app.use('/auth', signupRoute);
app.use('/auth', loginRoute); 




app.listen(PORT, ()=>{
    console.log(`[+] Server Running On Port ${PORT}`.green)
})
