const express = require('express');
const multer  = require('multer');

const router = express.Router();
const wrapasync = require("../../utils/wrapasync.js");
const EacListing = require("../../models/eaclisting.js"); // Changed to EacListing
const EacSyllabus = require("../../models/eacsyllabus.js"); // Changed to EacSyllabus
const ExpressError = require("../../utils/expressError.js");
const { isLoggedIn, isAdmin } = require("../../middleware.js");
const upload = require('../../middleware/eacuplode.js'); // Adjusted to EAC upload

// EAC index route...
router.get(
  "/",
  wrapasync(async (req, res) => {
    let eacdata = await EacListing.find();
    res.render("./eaclisting/eacindex.ejs", { eacdata });
  })
);

// New route to display the EAC syllabus
router.get(
  "/new", isLoggedIn,
  wrapasync(async (req, res) => {
    const syllabusData = await EacSyllabus.findOne({ department: "EAC" });

    if (!syllabusData) {
      return res.status(404).send("Syllabus document not found.");
    }

    const semesters = syllabusData.semesters;

    res.render("./eaclisting/eacnew.ejs", { semesters });
  })
);

// EAC create route
router.post(
  "/", isLoggedIn, isAdmin,
  upload.single('eaclisting[image]'),
  wrapasync(async (req, res) => {
    let eaclisting = req.body.eaclisting;

    try {
      let emails = eaclisting.contact.emails
        .split(",")
        .map(email => email.trim())
        .filter(email => email !== "");

      eaclisting.contact.emails = emails;

      const imageData = req.file
        ? {
            url: `/uploads/EAC/${req.file.filename}`,
            filename: req.file.filename
          }
        : undefined;

      let neweaclisting = new EacListing({
        ...eaclisting,
        image: imageData,
        owner: req.user._id
      });

      await neweaclisting.save();
      req.flash("success", "Added successfully!");
      res.redirect("/eaclisting");

    } catch (error) {
      console.error("Error saving EAC listing:", error);
      res.status(500).send("Server Error");
    }
  })
);

// EAC edit route...
router.get(
  "/:id/edit", isLoggedIn, isAdmin,
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let eacdata = await EacListing.findById(id);

    const syllabusData = await EacSyllabus.findOne({ department: "EAC" });

    if (!syllabusData) {
      return res.status(404).send("Syllabus document not found.");
    }

    const semesters = syllabusData.semesters;

    res.render("./eaclisting/eacedit.ejs", { eacdata, semesters });
  })
);

// EAC update route...
router.put(
  "/:id", isLoggedIn, isAdmin,
  upload.single("eaclisting[image]"),
  wrapasync(async (req, res) => {
    const { id } = req.params;
    let eaclisting = req.body.eaclisting;

    if (eaclisting.qualification) {
      eaclisting.qualification = eaclisting.qualification
        .split(",")
        .map((q) => q.trim());
    }

    if (eaclisting.contact && eaclisting.contact.emails) {
      eaclisting.contact.emails = eaclisting.contact.emails
        .split(",")
        .map((email) => email.trim());
    }

    if (req.file) {
      eaclisting.image = {
        url: `/uploads/EAC/${req.file.filename}`,
        filename: req.file.filename
      };
    }

    await EacListing.findByIdAndUpdate(id, { ...eaclisting });
    req.flash("success", "Updated successfully!");
    res.redirect(`/eaclisting/${id}`);
  })
);

// EAC delete route...
router.delete(
  "/:id", isLoggedIn, isAdmin,
  wrapasync(async (req, res) => {
    let { id } = req.params;

    await EacListing.findByIdAndDelete(id);
    req.flash("success", "Deleted successfully!");
    res.redirect(`/eaclisting`);
  })
);

// EAC show route...
router.get(
  "/:id", isLoggedIn,
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let eacdata = await EacListing.findById(id).populate("owner");

    if (!eacdata) {
      req.flash("error", "Something went wrong! User not found!");
      return res.redirect("/eaclisting");
    }

    res.render("./eaclisting/eacshow.ejs", { eacdata });
  })
);

module.exports = router;
