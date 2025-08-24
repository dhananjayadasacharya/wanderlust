
require('dotenv').config()    
let MONGO_URL = process.env.ATLAS_URL;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const path = require("path");
const ExpressError = require("./utils/ExpressError.js");
const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");
const chatbotRoute = require("./routes/chatbot.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");


async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("MongoDB Connected.");
}).catch((err)=>{
    console.log(err);
});

const store = MongoStore.create({  
    mongoUrl: MONGO_URL,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error",()=>{
    console.log("Error in mongo session store", err);
    
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    }
}
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.CurrUser = req.user;
    next();
});


app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", engine);
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.use(express.json()); // Add this to parse JSON requests
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/chatbot", chatbotRoute);
app.use("/",userRoute);




// app.get('/',(req,res)=>{
//     res.send("Hi ,I'm from Backend!")
// });
         
                
app.all("*",(req, res, next)=>{
    next(new ExpressError(404, "Page not found."));
});
app.use((err,req, res, next)=>{
    let {statusCode =500, message = "Something went wrong"} = err;
    res.status(statusCode).render("listings/error.ejs", {message});
});
app.listen(8080, () =>{
    console.log("Server listening on port 8080");
});