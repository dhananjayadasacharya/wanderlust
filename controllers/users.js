const User = require("../models/user");

module.exports.signup = async (req, res) => {
    try{
        let {email, username, password} = req.body;
        const newUser = new User({email, username});
         let registeredUser = await User.register(newUser, password);
         req.login(registeredUser, (err)=>{
            if(err)return next(err);
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
         });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.login = async (req, res) => {
    req.flash("success","Welcome back to Wanderlust!") ;
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
 }