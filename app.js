const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views/listings"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.engine("ejs", ejsMate);

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main(){
    mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("Connected to db");
})
.catch((err)=>{
    console.log(err);
})


//ROUTES 

app.get("/", (req,res)=>{
    res.send("Hi i am the root");
})

//INDEX OR READ ROUTE
app.get("/listings", async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("index", {allListings});
})
//CREATE ROUTE
app.get("/listings/new", (req,res)=>{
    res.render("new.ejs");
})


//SHOW INDIVIDUAL DATA
app.get("/listings/:id", async (req, res)=>{
    let {id} = req.params;
    const list = await Listing.findById(id);
    res.render("show", {list});
})


//POST ROUTE
app.post("/listings", async (req,res)=>{
    let {title, description, image, price, location, country} = req.body;
    const newlist = new Listing({
        title: title,
        description: description,
        image: image,
        price: price,
        location: location,
        country: country
    });
    await newlist.save();
    res.redirect("/listings");
})

//UPDATE ROUTE
app.get("/listings/:id/edit", async (req, res)=>{
    let {id} = req.params;
    let list = await Listing.findById(id);
    res.render("edit", {list});
})

app.put("/listings/:id", async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//DELETE REQUEST
app.delete("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

// app.get("/testlisting", async (req, res)=>{
//     let sampleListing = new Listing({
//         title:"My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location:"Calangute, GOA",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("Sample was saved..");
//     res.send("successful testing..");
// })


app.listen(8080, ()=>{
    console.log("Server listening at port 8080");
})