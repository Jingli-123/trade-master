const mongoose = require("mongoose");
const{ Schema } = mongoose;
const bcrypt = require("bcrypt");
const jobSchema = new mongoose.Schema({
    id:{type: String},
    jobname: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    description: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 2000
    },
    price: {
        type: Number,
        required: true
    },
    hours:{
        type: Number,

    },
    
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",   
    },
    emplyee:{
        type: String,
        
    },
    date: {
        type: Date,
        default: Date.now
    }
});


 module.exports = mongoose.model("Job", jobSchema);
