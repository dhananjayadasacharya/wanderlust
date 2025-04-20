const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, ValidateListing} = require("../middleware.js");
const listingControllers = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer( {storage} );

//show new route
router.get("/new", isLoggedIn, (req,res)=>{
    res.render("listings/new.ejs");
});


router.route("/")
    //index route
    .get(wrapAsync(listingControllers.index))
    //add route
    .post( isLoggedIn,upload.single("image"),ValidateListing, wrapAsync(listingControllers.addNewForm));
    // .post(upload.single("image"), (req, res)=>{
    //     res.send(req.file); 
    // });



router.route("/:id")
//show route
    .get( wrapAsync(listingControllers.showListing))
    //edit route
    .put( upload.single("image"), ValidateListing, isLoggedIn, isOwner, wrapAsync(listingControllers.editListing))
    //delete route
    .delete( isLoggedIn, isOwner, wrapAsync(listingControllers.destroyListing));

//show edit route
router.get("/:id/edit", isLoggedIn, wrapAsync(listingControllers.renderEditForm));


module.exports = router;