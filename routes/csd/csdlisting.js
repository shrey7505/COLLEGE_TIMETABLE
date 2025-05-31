const express = require('express');
const multer = require('multer');

const router = express.Router();
const wrapasync = require("../../utils/wrapasync.js");
const CSDListing = require("../../models/csdlisting.js");
const CSDSyllabus = require("../../models/csdsyllabus.js");
const ExpressError = require("../../utils/expressError.js");
const { isLoggedIn } = require("../../middleware.js");
const upload = require('../../middleware/csduplode.js'); // Adjust path if needed

// csd index route...
router.get(
  "/",
  wrapasync(async (req, res) => {
    let csddata = await CSDListing.find();
    res.render("./csdlisting/csdindex.ejs", { csddata });
  })
);

// New route to display the CSD syllabus
router.get(
  "/new", isLoggedIn,
  wrapasync(async (req, res) => {
    const syllabusData = await CSDSyllabus.findOne({ department: "CSD" });

    if (!syllabusData) {
      return res.status(404).send("Syllabus document not found.");
    }

    const semesters = syllabusData.semesters;
    res.render("./csdlisting/csdnew.ejs", { semesters });
  })
);

// CSD create route
router.post(
  "/", 
  isLoggedIn,
  upload.single('csdlisting[image]'),
  wrapasync(async (req, res) => {
    let csdlisting = req.body.csdlisting;

    try {
      let emails = csdlisting.contact.emails
        .split(",")
        .map(email => email.trim())
        .filter(email => email !== "");

      csdlisting.contact.emails = emails;

      const imageData = req.file
        ? {
            url: `/uploads/CSD/${req.file.filename}`,
            filename: req.file.filename
          }
        : undefined;

      let newcsdlisting = new CSDListing({
        ...csdlisting,
        image: imageData,
        owner: req.user._id
      });

      await newcsdlisting.save();
      req.flash("success", "Added successfully!");
      res.redirect("/csdlisting");

    } catch (error) {
      console.error("Error saving CSD listing:", error);
      res.status(500).send("Server Error");
    }
  })
);

// csd edit route...
router.get(
  "/:id/edit", isLoggedIn,
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let csddata = await CSDListing.findById(id);
    const syllabusData = await CSDSyllabus.findOne({ department: "CSD" });

    if (!syllabusData) {
      return res.status(404).send("Syllabus document not found.");
    }

    const semesters = syllabusData.semesters;
    res.render("./csdlisting/csdedit.ejs", { csddata, semesters });
  })
);

// csd update route...
router.put(
  "/:id", isLoggedIn,
  upload.single("csdlisting[image]"),
  wrapasync(async (req, res) => {
    const { id } = req.params;
    let csdlisting = req.body.csdlisting;

    if (csdlisting.qualifications) {
      csdlisting.qualifications = csdlisting.qualifications
        .split(",")
        .map((q) => q.trim());
    }

    if (csdlisting.contact && csdlisting.contact.emails) {
      csdlisting.contact.emails = csdlisting.contact.emails
        .split(",")
        .map((email) => email.trim());
    }

    if (req.file) {
      csdlisting.image = {
        url: `/uploads/CSD/${req.file.filename}`,
        filename: req.file.filename
      };
    }

    await CSDListing.findByIdAndUpdate(id, { ...csdlisting });
    req.flash("success", "Update successfully!");
    res.redirect(`/csdlisting/${id}`);
  })
);

// csd delete route...
router.delete(
  "/:id", isLoggedIn,
  wrapasync(async (req, res) => {
    let { id } = req.params;
    await CSDListing.findByIdAndDelete(id);
    req.flash("success", "Delete successfully!");
    res.redirect(`/csdlisting`);
  })
);

// csd show route...
router.get(
  "/:id", isLoggedIn,
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let csddata = await CSDListing.findById(id).populate("owner");
    if (!csddata) {
      req.flash("error", "Something went wrong! User not found!");
      return res.redirect("/csdlisting");
    }

    res.render("./csdlisting/csdshow.ejs", { csddata });
  })
);

module.exports = router;
