const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const methodOverride = require('method-override')
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const asyncWrap = require("./utils/wrapAsync.js");
const listingSchema = require("./schema.js");

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

app.get("/",(req,res)=>{
    res.render("listings/home.ejs");
});

app.get("/listings", asyncWrap(async (req, res) => {
    let dataa = await listing.find();
    // dataa.forEach(listing => {
    //     listing.formattedPrice = listing.price.toLocaleString("en-IN");
    // });
    res.render("listings/list.ejs", {dataa });
}));

app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

app.get("/listings/:id", asyncWrap(async(req,res)=>{
    let id = req.params.id;
    let post = await listing.findById(id);
    if (!post) throw new ExpressError(500,"You entered the wrong id.");
    res.render("listings/unique.ejs",{post});
}));

const validateListing = (req,res,next)=>{
    const result = listingSchema.validate(req.body);
    console.log(result); // {error}
    if(result.error) {
        let errMsg = result.error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else next();
}

app.post("/listings", validateListing, asyncWrap(async(req,res)=>{
    let newList = req.body;
    let AddedList = new listing(newList);
    await AddedList.save();
    res.redirect("/listings");
}));                

app.get("/listings/:id/edit", asyncWrap(async(req,res)=>{
    let id = req.params.id;
    let list = await listing.findById(id);
    res.render("listings/edit.ejs",{list});
}))

app.put("/listings/:id",validateListing, asyncWrap(async (req,res)=>{
    let id = req.params.id;
    let require = req.body;
    if(!req.body.listing) throw new ExpressError(400,"Send valid data for listing");
    await listing.findByIdAndUpdate(id, require);
    res.redirect(`/listings/${id}`);
}))

app.delete("/listings/:id/delete",asyncWrap(async(req,res)=>{
    let id = req.params.id;
    let delList = await listing.findById(id);
    await listing.findByIdAndDelete(id,delList);
    res.redirect("/listings");
}))

const handleValidationError = (err)=>{
    console.log("This was validation error pls follow rules");
    console.dir(err.message);
    return err;
}

// error name - mongoose error
app.use((err,req,res,next)=>{
    console.log(err.name);
    if(err.name === "ValidationError") {
       err = handleValidationError(err);
    }
    next(err);
})

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})

// error handling middleware
app.use((err,req,res,next)=>{
    let {status = 500,message = "Some error occured"} = err;
    res.status(status).render("listings/error.ejs",{message});
})

app.listen(3000,()=>{
    console.log('App is listening!');
});