const express = require('express');
const multer  = require('multer');

const router = express.Router();
const wrapasync = require("../../utils/wrapasync.js");
const MechenicalListing = require("../../models/mechenicallisting.js"); // Changed to MechenicalListing
const MechenicalSyllabus = require("../../models/mechenicalsyllabus.js"); // Changed to MechenicalSyllabus
const ExpressError = require("../../utils/expressError.js");
const { isLoggedIn, isAdmin } = require("../../middleware.js");
const upload = require('../../middleware/mechenicaluplode.js'); // Adjusted to Mechenical upload

// Mechenical index route...
router.get(
  "/",
  wrapasync(async (req, res) => {
    let mechenicaldata = await MechenicalListing.find();
    res.render("./mechenicallisting/mechenicalindex.ejs", { mechenicaldata });
  })
);

// New route to display the Mechenical syllabus
router.get(
  "/new", isLoggedIn,
  wrapasync(async (req, res) => {
    const syllabusData = await MechenicalSyllabus.findOne({ department: "MECHENICAL" });

    if (!syllabusData) {
      return res.status(404).send("Syllabus document not found.");
    }

    const semesters = syllabusData.semesters;

    res.render("./mechenicallisting/mechenicalnew.ejs", { semesters });
  })
);

// Mechenical create route
router.post(
  "/", isLoggedIn, isAdmin,
  upload.single('mechenicallisting[image]'),
  wrapasync(async (req, res) => {
    let mechenicallisting = req.body.mechenicallisting;

    try {
      let emails = mechenicallisting.contact.emails
        .split(",")
        .map(email => email.trim())
        .filter(email => email !== "");

      mechenicallisting.contact.emails = emails;

      const imageData = req.file
        ? {
            url: `/uploads/Mechenical/${req.file.filename}`,
            filename: req.file.filename
          }
        : undefined;

      let newmechenicallisting = new MechenicalListing({
        ...mechenicallisting,
        image: imageData,
        owner: req.user._id
      });

      await newmechenicallisting.save();
      req.flash("success", "Added successfully!");
      res.redirect("/mechenicallisting");

    } catch (error) {
      console.error("Error saving Mechenical listing:", error);
      res.status(500).send("Server Error");
    }
  })
);

// Mechenical edit route...
router.get(
  "/:id/edit", isLoggedIn, isAdmin,
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let mechenicaldata = await MechenicalListing.findById(id);

    const syllabusData = await MechenicalSyllabus.findOne({ department: "MECHENICAL" });

    if (!syllabusData) {
      return res.status(404).send("Syllabus document not found.");
    }

    const semesters = syllabusData.semesters;

    res.render("./mechenicallisting/mechenicaledit.ejs", { mechenicaldata, semesters });
  })
);

// Mechenical update route...
router.put(
  "/:id", isLoggedIn, isAdmin,
  upload.single("mechenicallisting[image]"),
  wrapasync(async (req, res) => {
    const { id } = req.params;
    let mechenicallisting = req.body.mechenicallisting;

    if (mechenicallisting.qualification) {
      mechenicallisting.qualification = mechenicallisting.qualification
        .split(",")
        .map((q) => q.trim());
    }

    if (mechenicallisting.contact && mechenicallisting.contact.emails) {
      mechenicallisting.contact.emails = mechenicallisting.contact.emails
        .split(",")
        .map((email) => email.trim());
    }

    if (req.file) {
      mechenicallisting.image = {
        url: `/uploads/Mechenical/${req.file.filename}`,
        filename: req.file.filename
      };
    }

    await MechenicalListing.findByIdAndUpdate(id, { ...mechenicallisting });
    req.flash("success", "Updated successfully!");
    res.redirect(`/mechenicallisting/${id}`);
  })
);

// Mechenical delete route...
router.delete(
  "/:id", isLoggedIn, isAdmin,
  wrapasync(async (req, res) => {
    let { id } = req.params;

    await MechenicalListing.findByIdAndDelete(id);
    req.flash("success", "Deleted successfully!");
    res.redirect(`/mechenicallisting`);
  })
);

// Mechenical show route...
router.get(
  "/:id", isLoggedIn,
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let mechenicaldata = await MechenicalListing.findById(id).populate("owner");

    if (!mechenicaldata) {
      req.flash("error", "Something went wrong! User not found!");
      return res.redirect("/mechenicallisting");
    }

    res.render("./mechenicallisting/mechenicalshow.ejs", { mechenicaldata });
  })
);

module.exports = router;