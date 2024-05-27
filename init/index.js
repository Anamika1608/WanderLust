const mongoose = require("mongoose");
const listing = require("../models/listing.js");
const initdata = require("./data.js");

main().then(console.log("Database connected succesfully"))
.catch(err => console.log(err));

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
} 

const initdb = async ()=>{
    await listing.insertMany(initdata.data);
    console.log("Data inserted successfully");
}

initdb();