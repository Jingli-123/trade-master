const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const jobRoute = require("./routes").job;
const passport = require("passport");
const { required } = require("joi");
require("./config/passport")(passport);
const cors = require("cors");
app.use(cors());


//connect to mongodb
mongoose.connect(process.env.DB_CONNECT).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err.message);
});

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", authRoute);
//Job router should be protected by passport
app.use(
    "/api/job",  
    passport.authenticate("jwt", { session: false }),
    jobRoute
);

//only the preson who login can create jobs.
//jwt token is required to create job.



app.listen(8080, () => {
    console.log("Server started on port 8080");
})