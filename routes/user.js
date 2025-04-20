const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/users");

router.route("/signup")
    .get((req, res)=>{
    res.render("users/signup.ejs");})
    .post(wrapAsync(userController.signup));

router.route("/login")
    .get((req, res)=>{
    res.render("users/login.ejs");})
    .post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}),userController.login);

    
//logout route
router.get("/logout",(req, res, next)=>{
    req.logout((err)=>{
        if(err)return next(err);
        req.flash("success", "Logged out successfully");
        res.redirect("/listings");
    });
});

module.exports = router;