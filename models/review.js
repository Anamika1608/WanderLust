const { string, date } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    review : String,
    rating : {
        type : Number,
        min : 1,
        max : 4
    },
    created_at : {
        type : Date,
        default : Date.now
    }
});

const review = mongoose.model("review",reviewSchema);

module.exports = review;