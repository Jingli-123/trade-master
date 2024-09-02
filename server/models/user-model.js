const mongoose = require("mongoose");
const{ Schema } = mongoose;
const bcrypt = require("bcrypt");
const { required } = require("joi");
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 50
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["employer", "employee"],
        default: "employee",
        required: true
    },
    company:{
        type: String,
        minlength: 3,
        maxlength: 50,
        default: "No company",
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

//instance methods
userSchema.methods.isEmployer = function() {
    return this.role === "employer";
};

userSchema.methods.isEmployee = function() {
    return this.role === "employee";
};

 userSchema.methods.comparePassword = async function(password, cb){
    let result;
    try{
        result = await bcrypt.compare(password, this.password);
        return cb(null, result);
    }catch(err){
        return cb(err, result);
    }  
 };

//mongoose middleware
 userSchema.pre("save", async function(next) {
    //this is presend mongoDB document
     if(this.isNew || this.isModified("password")) {
         const hashValue = await bcrypt.hash(this.password, 10);
         this.password = hashValue;
         
     }
     next();
 });

 module.exports = mongoose.model("User", userSchema);
