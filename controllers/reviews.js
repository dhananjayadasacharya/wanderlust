const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.destroyReview = async (req, res) => {
    const { id, revId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: revId}});
    await Review.findByIdAndDelete(revId);
    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
}

module.exports.postReview = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);        
    let newReview = new Review(req.body);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review posted!");
    res.redirect(`/listings/${id}`);
}