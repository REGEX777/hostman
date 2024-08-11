import 'dotenv/config';
import express from 'express';
import ejs from 'ejs';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import flash from 'connect-flash';
import errorLogger from './middleware/errorLogger.js';
import csrf from 'csurf';
import helmet from 'helmet';


// Database Initialization
mongoose.connect(process.env.MONGO_URI)
    .then(() => { console.log(`[INFORMATION]> Successfully connected to the database.`.green); })
    .catch(err => console.log(err));

// Session Configuration
const sessionStore = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
});

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorLogger);
app.use(helmet());

// Session middleware must be set up before flash
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    }
}));

app.use(flash());
const csrfProtection = csrf();

app.use(csrfProtection);

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});
// Initialize Passport and Session
app.use(passport.initialize());
app.use(passport.session());

// Flash messages middleware
app.use((req, res, next) => {
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
});

// Passport Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return done(null, false, { message: 'Invalid email or password.' });
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

// Serialize and Deserialize User
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

// Import and use routes
import userRoute from './routes/Home.js';
import keyDetails from './routes/keyDetails.js';
import embedEditor from './routes/embedEditor.js';
import apiControl from './routes/apiControl.js';
import postPage from './routes/postPage.js';
import signupRoute from './routes/Signup.js';
import loginRoute from './routes/Login.js';
import uploadRoute from './routes/Upload.js';
import account from './routes/Account.js'
import logsRoute from './routes/Logs.js';
import albumRoute from './routes/Album.js';
import favoriteRoute from './routes/favorites.js';
import commentRoute from './routes/comments.js';
import searchRoute from './routes/search.js';
import profileRoute from './routes/profile.js';
import embedEditorRoute from './routes/embedEditor.js';

app.use('/', userRoute);
app.use('/apidetails', keyDetails);
app.use('/embedEditor', embedEditor);
app.use('/api', apiControl);
app.use('/post', postPage);
app.use('/signup', signupRoute);
app.use('/login', loginRoute);
app.use('/upload', uploadRoute);
app.use('/account', account)
app.use('/logs', logsRoute);
app.use('/albums', albumRoute);
app.use('/favorites', favoriteRoute);
app.use('/comments', commentRoute);
app.use('/search', searchRoute);
app.use('/profile', profileRoute);
app.use('/embedEditor', embedEditorRoute);
app.use((req, res) => {
    res.status(404).render('404', { url: req.originalUrl });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`[+] Server Running On Port ${PORT}`.green);
});
