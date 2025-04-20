const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {ValidateReview, isLoggedIn, isAuthor} = require("../middleware.js");
const ReviewController = require("../controllers/reviews.js");


//delete review
router.delete("/:revId", isLoggedIn,isAuthor, wrapAsync(ReviewController.destroyReview));

//post review
router.post("/", ValidateReview, isLoggedIn, wrapAsync(ReviewController.postReview));
module.exports = router;