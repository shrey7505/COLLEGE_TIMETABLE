const express = require('express');
const multer  = require('multer');

const router = express.Router();
const wrapasync = require("../../utils/wrapasync.js");
const FptListing = require("../../models/fptlisting.js"); // Changed to FptListing
const FptSyllabus = require("../../models/fptsyllabus.js"); // Changed to FptSyllabus
const ExpressError = require("../../utils/expressError.js");
const { isLoggedIn, isAdmin } = require("../../middleware.js");
const upload = require('../../middleware/fptuplode.js'); // Adjusted to FPT upload

// FPT index route...
router.get(
  "/",
  wrapasync(async (req, res) => {
    let fptdata = await FptListing.find();
    res.render("./fptlisting/fptindex.ejs", { fptdata });
  })
);

// New route to display the FPT syllabus
router.get(
  "/new", isLoggedIn,
  wrapasync(async (req, res) => {
    const syllabusData = await FptSyllabus.findOne({ department: "FPT" });

    if (!syllabusData) {
      return res.status(404).send("Syllabus document not found.");
    }

    const semesters = syllabusData.semesters;

    res.render("./fptlisting/fptnew.ejs", { semesters });
  })
);

// FPT create route
router.post(
  "/", isLoggedIn, isAdmin,
  upload.single('fptlisting[image]'),
  wrapasync(async (req, res) => {
    let fptlisting = req.body.fptlisting;

    try {
      let emails = fptlisting.contact.emails
        .split(",")
        .map(email => email.trim())
        .filter(email => email !== "");

      fptlisting.contact.emails = emails;

      const imageData = req.file
        ? {
            url: `/uploads/FPT/${req.file.filename}`,
            filename: req.file.filename
          }
        : undefined;

      let newfptlisting = new FptListing({
        ...fptlisting,
        image: imageData,
        owner: req.user._id
      });

      await newfptlisting.save();
      req.flash("success", "Added successfully!");
      res.redirect("/fptlisting");

    } catch (error) {
      console.error("Error saving FPT listing:", error);
      res.status(500).send("Server Error");
    }
  })
);

// FPT edit route...
router.get(
  "/:id/edit", isLoggedIn, isAdmin,
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let fptdata = await FptListing.findById(id);

    const syllabusData = await FptSyllabus.findOne({ department: "FPT" });

    if (!syllabusData) {
      return res.status(404).send("Syllabus document not found.");
    }

    const semesters = syllabusData.semesters;

    res.render("./fptlisting/fptedit.ejs", { fptdata, semesters });
  })
);

// FPT update route...
router.put(
  "/:id", isLoggedIn, isAdmin,
  upload.single("fptlisting[image]"),
  wrapasync(async (req, res) => {
    const { id } = req.params;
    let fptlisting = req.body.fptlisting;

    if (fptlisting.qualification) {
      fptlisting.qualification = fptlisting.qualification
        .split(",")
        .map((q) => q.trim());
    }

    if (fptlisting.contact && fptlisting.contact.emails) {
      fptlisting.contact.emails = fptlisting.contact.emails
        .split(",")
        .map((email) => email.trim());
    }

    if (req.file) {
      fptlisting.image = {
        url: `/uploads/FPT/${req.file.filename}`,
        filename: req.file.filename
      };
    }

    await FptListing.findByIdAndUpdate(id, { ...fptlisting });
    req.flash("success", "Updated successfully!");
    res.redirect(`/fptlisting/${id}`);
  })
);

// FPT delete route...
router.delete(
  "/:id", isLoggedIn, isAdmin,
  wrapasync(async (req, res) => {
    let { id } = req.params;

    await FptListing.findByIdAndDelete(id);
    req.flash("success", "Deleted successfully!");
    res.redirect(`/fptlisting`);
  })
);

// FPT show route...
router.get(
  "/:id", isLoggedIn,
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let fptdata = await FptListing.findById(id).populate("owner");

    if (!fptdata) {
      req.flash("error", "Something went wrong! User not found!");
      return res.redirect("/fptlisting");
    }

    res.render("./fptlisting/fptshow.ejs", { fptdata });
  })
);

module.exports = router;
