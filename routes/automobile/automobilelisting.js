const express = require('express');
const multer  = require('multer');

const router = express.Router();
const wrapasync = require("../../utils/wrapasync.js");
const AutomobileListing = require("../../models/automobilelisting.js"); // Changed model name
const AutomobileSyllabus = require("../../models/automobilesyllabus.js"); // Changed syllabus model
const ExpressError = require("../../utils/expressError.js");
const { isLoggedIn } = require("../../middleware.js");
const upload = require('../../middleware/automobileuplode.js'); // Adjusted path for Automobile upload middleware

// Automobile index route
router.get(
  "/",
  wrapasync(async (req, res) => {
    let automobiledata = await AutomobileListing.find();
    res.render("./automobilelisting/automobileindex.ejs", { automobiledata });
  })
);

// New route to display the Automobile syllabus
router.get(
  "/new", isLoggedIn,
  wrapasync(async (req, res) => {
    const syllabusData = await AutomobileSyllabus.findOne({ department: "AUTOMOBILE" });

    if (!syllabusData) {
      return res.status(404).send("Syllabus document not found.");
    }

    const semesters = syllabusData.semesters;

    res.render("./automobilelisting/automobilenew.ejs", { semesters });
  })
);

// Automobile create route
router.post(
  "/",
  isLoggedIn,
  upload.single('automobilelisting[image]'),
  wrapasync(async (req, res) => {
    let automobilelisting = req.body.automobilelisting;

    try {
      let emails = automobilelisting.contact.emails
        .split(",")
        .map(email => email.trim())
        .filter(email => email !== "");

      automobilelisting.contact.emails = emails;

      const imageData = req.file
        ? {
            url: `/uploads/Automobile/${req.file.filename}`,
            filename: req.file.filename
          }
        : undefined;

      let newAutomobileListing = new AutomobileListing({
        ...automobilelisting,
        image: imageData,
        owner: req.user._id
      });

      await newAutomobileListing.save();
      req.flash("success", "Added successfully!");
      res.redirect("/automobilelisting");

    } catch (error) {
      console.error("Error saving Automobile listing:", error);
      res.status(500).send("Server Error");
    }
  })
);

// Automobile edit route
router.get(
  "/:id/edit", isLoggedIn,
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let automobiledata = await AutomobileListing.findById(id);

    const syllabusData = await AutomobileSyllabus.findOne({ department: "AUTOMOBILE" });

    if (!syllabusData) {
      return res.status(404).send("Syllabus document not found.");
    }

    const semesters = syllabusData.semesters;

    res.render("./automobilelisting/automobileedit.ejs", { automobiledata, semesters });
  })
);

// Automobile update route
router.put(
  "/:id", isLoggedIn,
  upload.single("automobilelisting[image]"),
  wrapasync(async (req, res) => {
    const { id } = req.params;
    let automobilelisting = req.body.automobilelisting;

    if (automobilelisting.qualification) {
      automobilelisting.qualification = automobilelisting.qualification
        .split(",")
        .map((q) => q.trim());
    }

    if (automobilelisting.contact && automobilelisting.contact.emails) {
      automobilelisting.contact.emails = automobilelisting.contact.emails
        .split(",")
        .map((email) => email.trim());
    }

    if (req.file) {
      automobilelisting.image = {
        url: `/uploads/Automobile/${req.file.filename}`,
        filename: req.file.filename
      };
    }

    await AutomobileListing.findByIdAndUpdate(id, { ...automobilelisting });
    req.flash("success", "Updated successfully!");
    res.redirect(`/automobilelisting/${id}`);
  })
);

// Automobile delete route
router.delete(
  "/:id", isLoggedIn,
  wrapasync(async (req, res) => {
    let { id } = req.params;

    await AutomobileListing.findByIdAndDelete(id);
    req.flash("success", "Deleted successfully!");
    res.redirect(`/automobilelisting`);
  })
);

// Automobile show route
router.get(
  "/:id", isLoggedIn,
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let automobiledata = await AutomobileListing.findById(id).populate("owner");

    if (!automobiledata) {
      req.flash("error", "Something went wrong! User not found!");
      return res.redirect("/automobilelisting");
    }

    res.render("./automobilelisting/automobileshow.ejs", { automobiledata });
  })
);

module.exports = router;
