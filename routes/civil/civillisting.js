const express = require('express');
const multer  = require('multer');

const router = express.Router();
const wrapasync = require("../../utils/wrapasync.js");
const CivilListing = require("../../models/civillisting.js"); // Changed to CivilListing
const CivilSyllabus = require("../../models/civilsyllabus.js"); // Changed to CivilSyllabus
const ExpressError = require("../../utils/expressError.js");
const { isLoggedIn, isAdmin } = require("../../middleware.js");
const upload = require('../../middleware/civiluplode.js'); // Adjusted to Civil upload

// Civil index route...
router.get(
  "/",
  wrapasync(async (req, res) => {
    let civildata = await CivilListing.find();
    res.render("./civillisting/civilindex.ejs", { civildata });
  })
);

// New route to display the Civil syllabus
router.get(
  "/new", isLoggedIn,
  wrapasync(async (req, res) => {
    const syllabusData = await CivilSyllabus.findOne({ department: "CIVIL" });

    if (!syllabusData) {
      return res.status(404).send("Syllabus document not found.");
    }

    const semesters = syllabusData.semesters;

    res.render("./civillisting/civilnew.ejs", { semesters });
  })
);

// Civil create route
router.post(
  "/", isLoggedIn, isAdmin,
  upload.single('civillisting[image]'),
  wrapasync(async (req, res) => {
    let civillisting = req.body.civillisting;

    try {
      let emails = civillisting.contact.emails
        .split(",")
        .map(email => email.trim())
        .filter(email => email !== "");

      civillisting.contact.emails = emails;

      const imageData = req.file
        ? {
            url: `/uploads/Civil/${req.file.filename}`,
            filename: req.file.filename
          }
        : undefined;

      let newcivillisting = new CivilListing({
        ...civillisting,
        image: imageData,
        owner: req.user._id
      });

      await newcivillisting.save();
      req.flash("success", "Added successfully!");
      res.redirect("/civillisting");

    } catch (error) {
      console.error("Error saving Civil listing:", error);
      res.status(500).send("Server Error");
    }
  })
);

// Civil edit route...
router.get(
  "/:id/edit", isLoggedIn, isAdmin,
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let civildata = await CivilListing.findById(id);

    const syllabusData = await CivilSyllabus.findOne({ department: "CIVIL" });

    if (!syllabusData) {
      return res.status(404).send("Syllabus document not found.");
    }

    const semesters = syllabusData.semesters;

    res.render("./civillisting/civiledit.ejs", { civildata, semesters });
  })
);

// Civil update route...
router.put(
  "/:id", isLoggedIn, isAdmin,
  upload.single("civillisting[image]"),
  wrapasync(async (req, res) => {
    const { id } = req.params;
    let civillisting = req.body.civillisting;

    if (civillisting.qualification) {
      civillisting.qualification = civillisting.qualification
        .split(",")
        .map((q) => q.trim());
    }

    if (civillisting.contact && civillisting.contact.emails) {
      civillisting.contact.emails = civillisting.contact.emails
        .split(",")
        .map((email) => email.trim());
    }

    if (req.file) {
      civillisting.image = {
        url: `/uploads/Civil/${req.file.filename}`,
        filename: req.file.filename
      };
    }

    await CivilListing.findByIdAndUpdate(id, { ...civillisting });
    req.flash("success", "Updated successfully!");
    res.redirect(`/civillisting/${id}`);
  })
);

// Civil delete route...
router.delete(
  "/:id", isLoggedIn, isAdmin,
  wrapasync(async (req, res) => {
    let { id } = req.params;

    await CivilListing.findByIdAndDelete(id);
    req.flash("success", "Deleted successfully!");
    res.redirect(`/civillisting`);
  })
);

// Civil show route...
router.get(
  "/:id", isLoggedIn,
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let civildata = await CivilListing.findById(id).populate("owner");

    if (!civildata) {
      req.flash("error", "Something went wrong! User not found!");
      return res.redirect("/civillisting");
    }

    res.render("./civillisting/civilshow.ejs", { civildata });
  })
);

module.exports = router;
