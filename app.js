const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const methodOverride = require('method-override')
const path = require("path");
const ejsMate = require("ejs-mate");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

main().then(console.log("Database connected succesfully"))
.catch(err => console.log(err));

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
} 

app.listen(3000,()=>{
    console.log('App is listening!');
});

app.get("/",(req,res)=>{
    res.render("listings/home.ejs");
});

app.get("/listings", async (req,res)=>{
    let dataa = await listing.find();
    res.render("listings/list.ejs",{dataa});
});

app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

app.get("/listings/:id",async (req,res)=>{
    let id = req.params.id;
    let post = await listing.findById(id);
    res.render("listings/unique.ejs",{post});
})

app.post("/listings",async (req,res)=>{
    let newList = req.body;
    let AddedList = new listing(newList);
    await AddedList.save();
    res.redirect("/listings");
})

app.get("/listings/:id/edit",async(req,res)=>{
    let id = req.params.id;
    let list = await listing.findById(id);
    res.render("listings/edit.ejs",{list});
})

app.put("/listings/:id",async (req,res)=>{
    let id = req.params.id;
    let require = req.body;
    await listing.findByIdAndUpdate(id, require);
    res.redirect(`/listings/${id}`);
}) 

app.delete("/listings/:id/delete",async(req,res)=>{
    let id = req.params.id;
    let delList = await listing.findById(id);
    await listing.findByIdAndDelete(id,delList);
    res.redirect("/listings");
})
