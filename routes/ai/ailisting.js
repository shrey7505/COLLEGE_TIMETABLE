const express = require('express');
const multer  = require('multer');

const router = express.Router();
const wrapasync = require("../../utils/wrapasync.js");
const AiListing = require("../../models/ailisting.js"); // Change model name to AiListing
const AiSyllabus = require("../../models/aisyllabus.js"); // This can remain as it's used for syllabus
const ExpressError = require("../../utils/expressError.js");
const { isLoggedIn,isAdmin } = require("../../middleware.js");
const upload = require('../../middleware/aiuplode.js'); // Adjust path as needed

// AI index route...
router.get(
  "/",
  wrapasync(async (req, res) => {
    let aidata = await AiListing.find(); // Changed to AiListing
    res.render("./ailisting/aiindex.ejs", { aidata });
  })
);

// New route to display the AI syllabus
router.get(
  "/new", isLoggedIn,
  wrapasync(async (req, res) => {
    const syllabusData = await AiSyllabus.findOne({ department: "AI" }); // Adjusted to AI department

    if (!syllabusData) {
      return res.status(404).send("Syllabus document not found.");
    }

    const semesters = syllabusData.semesters;

    res.render("./ailisting/ainew.ejs", { semesters });
  })
);

// AI create route
router.post(
  "/",
  isLoggedIn,isAdmin,
  upload.single('ailisting[image]'), // Adjust image upload field if needed
  wrapasync(async (req, res) => {
    let ailisting = req.body.ailisting;

    try {
      let emails = ailisting.contact.emails
        .split(",")
        .map(email => email.trim())
        .filter(email => email !== "");

      ailisting.contact.emails = emails;

      const imageData = req.file
        ? {
            url: `/uploads/AI/${req.file.filename}`,
            filename: req.file.filename
          }
        : undefined;

      let newailisting = new AiListing({
        ...ailisting,
        image: imageData,
        owner: req.user._id
      });

      await newailisting.save();
      req.flash("success", "Added successfully!");
      res.redirect("/ailisting");

    } catch (error) {
      console.error("Error saving AI listing:", error);
      res.status(500).send("Server Error");
    }
  })
);

// AI edit route...
router.get(
  "/:id/edit", isLoggedIn,isAdmin,
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let aidata = await AiListing.findById(id); // Changed to AiListing

    const syllabusData = await AiSyllabus.findOne({ department: "AI" });

    const semesters = syllabusData.semesters;

    res.render("./ailisting/aiedit.ejs", { aidata, semesters });

    if (!syllabusData) {
      return res.status(404).send("Syllabus document not found.");
    }
  })
);

// AI update route...
router.put(
  "/:id", isLoggedIn,isAdmin,
  upload.single("ailisting[image]"),
  wrapasync(async (req, res) => {
    const { id } = req.params;
    let ailisting = req.body.ailisting;

    if (ailisting.qualification) {
      ailisting.qualification = ailisting.qualification
        .split(",")
        .map((q) => q.trim());
    }

    if (ailisting.contact && ailisting.contact.emails) {
      ailisting.contact.emails = ailisting.contact.emails
        .split(",")
        .map((email) => email.trim());
    }

    if (req.file) {
      ailisting.image = {
        url: `/uploads/AI/${req.file.filename}`,
        filename: req.file.filename
      };
    }

    await AiListing.findByIdAndUpdate(id, { ...ailisting });
    req.flash("success", "Updated successfully!");
    res.redirect(`/ailisting/${id}`);
  })
);

// AI delete route...
router.delete(
  "/:id", isLoggedIn,isAdmin,
  wrapasync(async (req, res) => {
    let { id } = req.params;

    await AiListing.findByIdAndDelete(id);
    req.flash("success", "Deleted successfully!");
    res.redirect(`/ailisting`);
  })
);

// AI show route...
router.get(
  "/:id", isLoggedIn,
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let aidata = await AiListing.findById(id).populate("owner");

    if (!aidata) {
      req.flash("error", "Something went wrong! User not found!");
      return res.redirect("/ailisting");
    }

    res.render("./ailisting/aishow.ejs", { aidata });
  })
);

module.exports = router;
