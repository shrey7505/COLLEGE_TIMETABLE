const express = require('express');
const multer = require('multer');

const router = express.Router();
const wrapasync = require("../../utils/wrapasync.js");
const ElectricalListing = require("../../models/electricallisting.js"); // Changed to ElectricalListing
const ElectricalSyllabus = require("../../models/electricalsyllabus.js"); // Changed to ElectricalSyllabus
const ExpressError = require("../../utils/expressError.js");
const { isLoggedIn, isAdmin } = require("../../middleware.js");
const upload = require('../../middleware/electricaluplode.js'); // Adjusted to Electrical upload

// Electrical index route...
router.get(
  "/",
  wrapasync(async (req, res) => {
    let electricaldata = await ElectricalListing.find();
    res.render("./electricallisting/electricalindex.ejs", { electricaldata });
  })
);

// New route to display the Electrical syllabus
router.get(
  "/new", isLoggedIn,
  wrapasync(async (req, res) => {
    const syllabusdata = await ElectricalSyllabus.findOne({ department: "ELECTRICAL" });

    if (!syllabusdata) {
      return res.status(404).send("Syllabus document not found.");
    }

    const semesters = syllabusdata.semesters;

    res.render("./electricallisting/electricalnew.ejs", { semesters });
  })
);

// Electrical create route
router.post(
  "/", isLoggedIn, isAdmin,
  upload.single('electricallisting[image]'),
  wrapasync(async (req, res) => {
    let electricalListing = req.body.electricallisting;

    try {
      let emails = electricalListing.contact.emails
        .split(",")
        .map(email => email.trim())
        .filter(email => email !== "");

      electricalListing.contact.emails = emails;

      const imagedata = req.file
        ? {
            url: `/uploads/Electrical/${req.file.filename}`,
            filename: req.file.filename
          }
        : undefined;

      let newElectricalListing = new ElectricalListing({
        ...electricalListing,
        image: imagedata,
        owner: req.user._id
      });

      await newElectricalListing.save();
      req.flash("success", "Added successfully!");
      res.redirect("/electricallisting");

    } catch (error) {
      console.error("Error saving Electrical listing:", error);
      res.status(500).send("Server Error");
    }
  })
);

// Electrical edit route...
router.get(
  "/:id/edit", isLoggedIn, isAdmin,
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let electricaldata = await ElectricalListing.findById(id);

    const syllabusdata = await ElectricalSyllabus.findOne({ department: "ELECTRICAL" });

    if (!syllabusdata) {
      return res.status(404).send("Syllabus document not found.");
    }

    const semesters = syllabusdata.semesters;

    res.render("./electricallisting/electricaledit.ejs", { electricaldata, semesters });
  })
);

// Electrical update route...
router.put(
  "/:id", isLoggedIn, isAdmin,
  upload.single("electricallisting[image]"),
  wrapasync(async (req, res) => {
    const { id } = req.params;
    let electricalListing = req.body.electricallisting;

    if (electricalListing.qualification) {
      electricalListing.qualification = electricalListing.qualification
        .split(",")
        .map((q) => q.trim());
    }

    if (electricalListing.contact && electricalListing.contact.emails) {
      electricalListing.contact.emails = electricalListing.contact.emails
        .split(",")
        .map((email) => email.trim());
    }

    if (req.file) {
      electricalListing.image = {
        url: `/uploads/Electrical/${req.file.filename}`,
        filename: req.file.filename
      };
    }

    await ElectricalListing.findByIdAndUpdate(id, { ...electricalListing });
    req.flash("success", "Updated successfully!");
    res.redirect(`/electricallisting/${id}`);
  })
);

// Electrical delete route...
router.delete(
  "/:id", isLoggedIn, isAdmin,
  wrapasync(async (req, res) => {
    let { id } = req.params;

    await ElectricalListing.findByIdAndDelete(id);
    req.flash("success", "Deleted successfully!");
    res.redirect(`/electricallisting`);
  })
);

// Electrical show route...
router.get(
  "/:id", isLoggedIn,
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let electricaldata = await ElectricalListing.findById(id).populate("owner");

    if (!electricaldata) {
      req.flash("error", "Something went wrong! User not found!");
      return res.redirect("/electricallisting");
    }

    res.render("./electricallisting/electricalshow.ejs", { electricaldata });
  })
);

module.exports = router;
