const express=require('express');
const multer  = require('multer')

const router=express.Router();
const wrapasync = require("../../utils/wrapasync.js");
const ItListing = require("../../models/itlisting.js");
const ItSyllabus = require("../../models/itsyllabus.js");
const ExpressError = require("../../utils/expressError.js");
const{isLoggedIn,isAdmin}=require("../../middleware.js");
const upload = require('../../middleware/ituplode.js'); // Adjust path as needed






// it index route...
router.get(
    "/",
    wrapasync(async (req, res) => {
      let itdata = await ItListing.find();
      res.render("./itlisting/itindex.ejs", { itdata });
    })
  );
  
  // New route to display the IT syllabus
  router.get(
    "/new",isLoggedIn,
    wrapasync(async (req, res) => {
      // const syllabusId = "67e7e85fa334510e73525c8b"; // Move ID to variable for clarity
      // const syllabusData = await ItSyllabus.findById(syllabusId);
      const syllabusData = await ItSyllabus.findOne({ department: "IT" });
  
      if (!syllabusData) {
        return res.status(404).send("Syllabus document not found.");
      }
  
      // Access semesters directly from syllabusData
      const semesters = syllabusData.semesters; // Corrected line
  
      // Render the EJS template with the semesters data
      res.render("./itlisting/itnew.ejs", { semesters });
    })
  );
  
  // IT create route
router.post(
  "/", 
  isLoggedIn,
  upload.single('itlisting[image]'),
  wrapasync(async (req, res) => {
    let itlisting = req.body.itlisting;

    try {
      // Process emails correctly
      let emails = itlisting.contact.emails
        .split(",")
        .map(email => email.trim())
        .filter(email => email !== "");

      itlisting.contact.emails = emails;

      // Handle image (use default logic from schema)
      const imageData = req.file
      ? {
          url: `/uploads/IT/${req.file.filename}`,
          filename: req.file.filename
        }
      : undefined;

      // Save to MongoDB
      let newitlisting = new ItListing({
        ...itlisting,
        image: imageData,
        owner: req.user._id
      });

      await newitlisting.save();
      req.flash("success", "Added successfully!");
      res.redirect("/itlisting");

    } catch (error) {
      console.error("Error saving IT listing:", error);
      res.status(500).send("Server Error");
    }
  })
);

  
  //it edit route...
  router.get(
    "/:id/edit",isLoggedIn,
    wrapasync(async (req, res) => {
      let { id } = req.params; // Get the ID from the request parameters
      let itdata = await ItListing.findById(id); // Find the IT listing by ID
  
      // const syllabusId = "67e7e85fa334510e73525c8b"; // Move ID to variable for clarity
      // const syllabusData = await ItSyllabus.findById(syllabusId);
      const syllabusData = await ItSyllabus.findOne({ department: "IT" });
  
     
  
      // Access semesters directly from syllabusData
      const semesters = syllabusData.semesters; // Corrected line
  
      // Render the EJS template with itdata and semesters
      res.render("./itlisting/itedit.ejs", { itdata, semesters });

      if (!syllabusData) {
        return res.status(404).send("Syllabus document not found.");
      }
    })
    
  );
  
  //it update route...
  router.put(
    "/:id",isLoggedIn,
    upload.single("itlisting[image]"),
    wrapasync(async (req, res) => {
      const { id } = req.params;
      let itlisting = req.body.itlisting;
  
      // Process qualification and emails
      if (itlisting.qualification) {
        itlisting.qualification = itlisting.qualification
          .split(",")
          .map((q) => q.trim());
      }
  
      if (itlisting.contact && itlisting.contact.emails) {
        itlisting.contact.emails = itlisting.contact.emails
          .split(",")
          .map((email) => email.trim());
      }

      if (req.file) {
        itlisting.image = {
          url: `/uploads/IT/${req.file.filename}`,
          filename: req.file.filename
        };
      }
  
      await ItListing.findByIdAndUpdate(id, { ...itlisting });
      req.flash("success", "update successfully!");
      res.redirect(`/itlisting/${id}`);
    })
  );
  
  //it delete route...
  //it update route...
  router.delete(
    "/:id",isLoggedIn,
    wrapasync(async (req, res) => {
      let { id } = req.params;
  
      // let itlisting=req.body.itlisting;
      await ItListing.findByIdAndDelete(id);
      req.flash("success", "delete successfully!");
      res.redirect(`/itlisting`);
    })
  );
  
  // it show route...
  router.get(
    "/:id",isLoggedIn,
    wrapasync(async (req, res) => {
      let { id } = req.params;
      let itdata = await ItListing.findById(id).populate("owner");
      if (!itdata) {
        req.flash("error", "somthing went wrong! user note found!");
        return res.redirect("/itlisting");
      }
      
      res.render("./itlisting/itshow.ejs", { itdata });
    })
  );
  module.exports = router;