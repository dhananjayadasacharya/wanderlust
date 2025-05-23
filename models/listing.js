const mongoose = require('mongoose');
const Review = require("./review.js");
const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description:String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    reviews:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    },]
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in: listing.reviews}});
    }
});
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;