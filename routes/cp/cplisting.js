const express = require('express');
const multer = require('multer');

const router = express.Router();
const wrapasync = require("../../utils/wrapasync.js");
const CpListing = require("../../models/cplisting.js");
const CpSyllabus = require("../../models/cpsyllabus.js");
const ExpressError = require("../../utils/expressError.js");
const { isLoggedIn } = require("../../middleware.js");
const upload = require('../../middleware/cpuplode.js'); // Adjust path if needed

// cp index route...
router.get(
  "/",
  wrapasync(async (req, res) => {
    let cpdata = await CpListing.find();
    res.render("./cplisting/cpindex.ejs", { cpdata });
  })
);

// New route to display the CP syllabus
router.get(
  "/new", isLoggedIn,
  wrapasync(async (req, res) => {
    const syllabusData = await CpSyllabus.findOne({ department: "CP" });

    if (!syllabusData) {
      return res.status(404).send("Syllabus document not found.");
    }

    const semesters = syllabusData.semesters;
    res.render("./cplisting/cpnew.ejs", { semesters });
  })
);

// CP create route
router.post(
  "/", 
  isLoggedIn,
  upload.single('cplisting[image]'),
  wrapasync(async (req, res) => {
    let cplisting = req.body.cplisting;

    try {
      let emails = cplisting.contact.emails
        .split(",")
        .map(email => email.trim())
        .filter(email => email !== "");

      cplisting.contact.emails = emails;

      const imageData = req.file
        ? {
            url: `/uploads/CP/${req.file.filename}`,
            filename: req.file.filename
          }
        : undefined;

      let newcplisting = new CpListing({
        ...cplisting,
        image: imageData,
        owner: req.user._id
      });

      await newcplisting.save();
      req.flash("success", "Added successfully!");
      res.redirect("/cplisting");

    } catch (error) {
      console.error("Error saving CP listing:", error);
      res.status(500).send("Server Error");
    }
  })
);

// cp edit route...
router.get(
  "/:id/edit", isLoggedIn,
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let cpdata = await CpListing.findById(id);
    const syllabusData = await CpSyllabus.findOne({ department: "CP" });

    if (!syllabusData) {
      return res.status(404).send("Syllabus document not found.");
    }

    const semesters = syllabusData.semesters;
    res.render("./cplisting/cpedit.ejs", { cpdata, semesters });
  })
);

// cp update route...
router.put(
  "/:id", isLoggedIn,
  upload.single("cplisting[image]"),
  wrapasync(async (req, res) => {
    const { id } = req.params;
    let cplisting = req.body.cplisting;

    if (cplisting.qualifications) {
      cplisting.qualifications = cplisting.qualifications
        .split(",")
        .map((q) => q.trim());
    }

    if (cplisting.contact && cplisting.contact.emails) {
      cplisting.contact.emails = cplisting.contact.emails
        .split(",")
        .map((email) => email.trim());
    }

    if (req.file) {
      cplisting.image = {
        url: `/uploads/CP/${req.file.filename}`,
        filename: req.file.filename
      };
    }

    await CpListing.findByIdAndUpdate(id, { ...cplisting });
    req.flash("success", "Update successfully!");
    res.redirect(`/cplisting/${id}`);
  })
);

// cp delete route...
router.delete(
  "/:id", isLoggedIn,
  wrapasync(async (req, res) => {
    let { id } = req.params;
    await CpListing.findByIdAndDelete(id);
    req.flash("success", "Delete successfully!");
    res.redirect(`/cplisting`);
  })
);

// cp show route...
router.get(
  "/:id", isLoggedIn,
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let cpdata = await CpListing.findById(id).populate("owner");
    if (!cpdata) {
      req.flash("error", "Something went wrong! User not found!");
      return res.redirect("/cplisting");
    }

    res.render("./cplisting/cpshow.ejs", { cpdata });
  })
);

module.exports = router;
