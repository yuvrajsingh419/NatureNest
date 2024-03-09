if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

// console.log(process.env.SECRET)
// console.log(process.env.API_KEY)

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
// const Joi = require('joi');
const {CampgroundSchema, reviewSchema}= require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');



// const mongoSanitize = require('express-mongo-sanitize');

const userRoutes = require('./routes/users')
const campgroundRoutes  = require('./routes/campground');
const reviewRoutes = require('./routes/review');
const review = require('./models/review');
const { isLoggedIn } = require('./middleware.js');

const stripe = require('stripe')('sk_test_51Njw6nSAF0QiCviy6gSSYtOUYQkAzKXBwlpl60dEcCGJOgvghafRbfC923ryts0T5Y5gu8veEdc8PMSrMuLr3wpd00RM4PYigJ');


mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db= mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database conected");
});

const app = express();

app.engine('ejs',ejsMate)

app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'))

app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))
// app.use(mongoSanitize({
//     replaceWith: '_'
// }))

const sessionConfig = {
    // name: 'session',
    secret: 'thishsouldbeabettersecret!',
    resave: false,
    saveUnitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now()+ 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

  

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    console.log(req.session)
    // console.log(req.query);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// app.get('/fakeUser', async(req,res)=>{
//     const user = new User({ email: 'yuvrajsingh1619@gmail.com', username: 'yuvi'})
//     const newUser = await User.register(user, 'yuvi');
//     res.send(newUser);
// })

app.use('/', userRoutes);
app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/reviews',reviewRoutes)

app.get('/',(req,res)=>{
    res.render('home')
});
app.get('/pay',isLoggedIn, (req, res) => {
    // Handle the payment logic here
    res.render('pay');
});

app.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'inr',
                product_data: {
                    name: 'Buddy Finder',
                },
                unit_amount: 99, // Amount in cents
            },
            quantity: 1,
        }],
        mode: 'payment',
        success_url: 'http://localhost:5000/campgrounds',
        cancel_url: 'http://localhost:5000/cancel',
    });

    res.json({ id: session.id });
    // res.render('campgrounds')
});


app.all('*',(req,res, next)=>{
    next(new ExpressError('Page Not Found',404))
})


app.use((err,req,res,next)=>{
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no, Something went wrong!!'
    res.status(statusCode).render('error',{err});
})


app.listen(5000,()=>{
    console.log("Serving on port 5000")
})