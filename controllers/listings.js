const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
}

module.exports.showListing = async (req,res) => {
    const { id } = req.params;
    const listData = await Listing.findById(id).populate({path: "reviews", populate: {path:"author"}}).populate("owner");
    if(!listData){
        req.flash("error", "Listing not found!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{ listData });
}

module.exports.addNewForm = async (req,res) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1
      })
        .send()
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req,res) => {
    const { id } = req.params;
    let listings = await Listing.findById(id);
    if(!listings){
        req.flash("error", "Listing not found!");
        res.redirect("/listings");
    }
    let originalImageURL = listings.image.url;
    originalImageURL = originalImageURL.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listings, originalImageURL });
}

module.exports.editListing = async (req,res) => {
    const { id } = req.params;
    let response = await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1
      })
        .send()
    let listing = await Listing.findByIdAndUpdate(id, req.body);
    listing.geometry = response.body.features[0].geometry;
    let change = await listing.save();
    console.log(change);
    
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename};
        await listing.save();    
    }
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req,res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
}