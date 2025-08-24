const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema ,reviewSchema} = require("./validateSchema.js");

module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        // console.log(req.originalUrl);
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Please login to Wanderlust!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl =(req, res ,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next)=>{
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.CurrUser._id)){
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isAuthor = async (req, res, next)=>{
    const { id ,revId } = req.params;
    let review = await Review.findById(revId);
    if(!review.author._id.equals(res.locals.CurrUser._id)){
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.ValidateListing = (req,res,next)=>{
    let result = listingSchema.validate(req.body);
    if(result.error) {
        next(new ExpressError(400, result.error.message));
    } else {
        next();
    }
}

module.exports.ValidateReview = (req,res,next)=>{
    let result = reviewSchema.validate(req.body);
    if(result.error) {
        next(new ExpressError(400, result.error.message));
    } else {
        next();
    }
}