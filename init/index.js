const mongoose = require('mongoose');
const Listing = require("../models/listing.js");
const initData = require("./data.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("MongoDB Connected.");
}).catch((err)=>{
    console.log(err);
});

const initDB = async ()=>{
    await Listing.deleteMany();
    initData.data = initData.data.map((obj)=>({...obj, owner:"67f7f48ff0ae5e87172aae07"}));
    await Listing.insertMany(initData.data);
}
initDB();