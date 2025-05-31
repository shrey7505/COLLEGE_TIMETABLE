const express = require('express');
const multer  = require('multer');

const router = express.Router();
const wrapasync = require("../../utils/wrapasync.js");
const DtListing = require("../../models/dtlisting.js"); // Changed to DtListing
const DtSyllabus = require("../../models/dtsyllabus.js"); // Changed to DtSyllabus
const ExpressError = require("../../utils/expressError.js");
const { isLoggedIn, isAdmin } = require("../../middleware.js");
const upload = require('../../middleware/dtuplode.js'); // Adjusted to DT upload

// DT index route...
router.get(
  "/",
  wrapasync(async (req, res) => {
    let dtdata = await DtListing.find();
    res.render("./dtlisting/dtindex.ejs", { dtdata });
  })
);

// New route to display the DT syllabus
router.get(
  "/new", isLoggedIn,
  wrapasync(async (req, res) => {
    const syllabusData = await DtSyllabus.findOne({ department: "DT" });

    if (!syllabusData) {
      return res.status(404).send("Syllabus document not found.");
    }

    const semesters = syllabusData.semesters;

    res.render("./dtlisting/dtnew.ejs", { semesters });
  })
);

// DT create route
router.post(
  "/", isLoggedIn, isAdmin,
  upload.single('dtlisting[image]'),
  wrapasync(async (req, res) => {
    let dtlisting = req.body.dtlisting;

    try {
      let emails = dtlisting.contact.emails
        .split(",")
        .map(email => email.trim())
        .filter(email => email !== "");

      dtlisting.contact.emails = emails;

      const imageData = req.file
        ? {
            url: `/uploads/DT/${req.file.filename}`,
            filename: req.file.filename
          }
        : undefined;

      let newdtlisting = new DtListing({
        ...dtlisting,
        image: imageData,
        owner: req.user._id
      });

      await newdtlisting.save();
      req.flash("success", "Added successfully!");
      res.redirect("/dtlisting");

    } catch (error) {
      console.error("Error saving DT listing:", error);
      res.status(500).send("Server Error");
    }
  })
);

// DT edit route...
router.get(
  "/:id/edit", isLoggedIn, isAdmin,
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let dtdata = await DtListing.findById(id);

    const syllabusData = await DtSyllabus.findOne({ department: "DT" });

    if (!syllabusData) {
      return res.status(404).send("Syllabus document not found.");
    }

    const semesters = syllabusData.semesters;

    res.render("./dtlisting/dtedit.ejs", { dtdata, semesters });
  })
);

// DT update route...
router.put(
  "/:id", isLoggedIn, isAdmin,
  upload.single("dtlisting[image]"),
  wrapasync(async (req, res) => {
    const { id } = req.params;
    let dtlisting = req.body.dtlisting;

    if (dtlisting.qualification) {
      dtlisting.qualification = dtlisting.qualification
        .split(",")
        .map((q) => q.trim());
    }

    if (dtlisting.contact && dtlisting.contact.emails) {
      dtlisting.contact.emails = dtlisting.contact.emails
        .split(",")
        .map((email) => email.trim());
    }

    if (req.file) {
      dtlisting.image = {
        url: `/uploads/DT/${req.file.filename}`,
        filename: req.file.filename
      };
    }

    await DtListing.findByIdAndUpdate(id, { ...dtlisting });
    req.flash("success", "Updated successfully!");
    res.redirect(`/dtlisting/${id}`);
  })
);

// DT delete route...
router.delete(
  "/:id", isLoggedIn, isAdmin,
  wrapasync(async (req, res) => {
    let { id } = req.params;

    await DtListing.findByIdAndDelete(id);
    req.flash("success", "Deleted successfully!");
    res.redirect(`/dtlisting`);
  })
);

// DT show route...
router.get(
  "/:id", isLoggedIn,
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let dtdata = await DtListing.findById(id).populate("owner");

    if (!dtdata) {
      req.flash("error", "Something went wrong! User not found!");
      return res.redirect("/dtlisting");
    }

    res.render("./dtlisting/dtshow.ejs", { dtdata });
  })
);

module.exports = router;
