const router = require("express").Router();
const Job = require("../models/job-model");
const jobValidation = require("../routes/validation").jobValidation;
const User = require("../models/user-model");


router.use((req, res, next) => {
    console.log("job route is receving a request...");
    next();
  });
  
  // get all the jobs
  router.get("/", async (req, res) => {
    try {
      let jobFound = await Job.find({})
        .populate("employer", ["username", "email"])
        .exec();
      return res.send(jobFound);
    } catch (e) {
      return res.status(5000).send(e);
    }
  });
  

  router.get("/employer/:_employer_id", async (req, res) => {
    let { _employer_id } = req.params;
    let jobsFound = await Job.find({ employer: _employer_id })
      .populate("employer", ["username", "email"])
      .exec();
    return res.send(jobsFound);
  });
  
  
  router.get("/employee/:_employee_id", async (req, res) => {
    let { _employee_id } = req.params;
    let jobsFound = await Job.find({ employee: _employee_id })
      .populate("employer", ["username", "email"])
      .exec();
    return res.send(jobsFound);
  });
  

  router.get("/findByName/:name", async (req, res) => {
    let { name } = req.params;
    try {
      let jobFound = await Job.find({ jobname: name })
        .populate("employer", ["email", "username"])
        .exec();
      return res.send(jobFound);
    } catch (e) {
      return res.status(500).send(e);
    }
  });
  

  router.get("/:_id", async (req, res) => {
    let { _id } = req.params;
    try {
      let jobFound = await Job.findOne({ _id })
        .populate("employer", ["email"])
        .exec();
      return res.send(jobFound);
    } catch (e) {
      return res.status(500).send(e);
    }
  });
  

  router.post("/", async (req, res) => {
 
    let { error } = jobValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    if (req.user.isEmployee()) {
      return res
        .status(400)
        .send("Only employer can do this operation");
    }
  
    let { jobname, description, price } = req.body;
    try {
      let newJob = new Job({
        jobname,
        description,
        price,
        employer: req.user._id,
      });
      let savedJob = await newJob.save();
      return res.send("saved successfully");

    } catch (e) {
      return res.status(500).send("can't save。。。");
    }
  });
  

  router.post("/enroll/:_id", async (req, res) => {
    let { _id } = req.params;
    try {
      let job = await Job.findOne({ _id }).exec();
      job.emplyee.push(req.user._id);
      await course.save();
      return res.send("request successful");
    } catch (e) {
      return res.send(e);
    }
  });
  

  router.patch("/:_id", async (req, res) => {
   
    let { error } = jobValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    let { _id } = req.params;
    
    try {
      let jobFound = await Job.findOne({ _id });
      if (!jobFound) {
        return res.status(400).send("can't find the job");
      }
  
     
      if (jobFound.employer.equals(req.user._id)) {
        let updatedJob = await Job.findOneAndUpdate({ _id }, req.body, {
          new: true,
          runValidators: true,
        });
        return res.send({
          message: "Updated successfully",
          updatedJob,
        });
      } else {
        return res.status(403).send("Only the employer can update this job");
      }
    } catch (e) {
      return res.status(500).send(e);
    }
  });
  
  router.delete("/:_id", async (req, res) => {
    let { _id } = req.params;

    try {
      let jobFound = await Job.findOne({ _id }).exec();
      if (!jobFound) {
        return res.status(400).send("Can't find the job");
      }
  
    
      if (jobFound.employer.equals(req.user._id)) {
        await Job.deleteOne({ _id }).exec();
        return res.send("Deleted successfully");
      } else {
        return res.status(403).send("Only the employer can delete this job");
      }
    } catch (e) {
      return res.status(500).send(e);
    }
  });
  

  

module.exports = router;