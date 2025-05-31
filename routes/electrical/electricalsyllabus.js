const express = require("express");
const router = express.Router();
const ElectricalListing = require("../../models/electricallisting.js"); // Changed from electricalListing to ElectricalListing
const ElectricalSyllabus = require("../../models/electricalsyllabus.js"); // Changed from electricalSyllabus to ElectricalSyllabus
const Timetable = require("../../models/timetable.js");
const wrapasync = require("../../utils/wrapasync.js");
const ItClassAndLeb = require("../../models/itclassandleb.js"); // Keep as is unless Electrical has its own
const { isLoggedIn, isAdmin } = require("../../middleware.js");

// Electrical syllabus index route
router.get("/", isLoggedIn, wrapasync(async (req, res) => {
  const syllabus = await ElectricalSyllabus.findOne({ department: "ELECTRICAL" }); // Changed to Electrical

  if (!syllabus) {
    return res.status(404).send("Syllabus not found");
  }

  return res.render("./electricalsyllabus/electricalsyllabusindex.ejs", {
    semesters: syllabus.semesters,
  });
}));

// Add Electrical syllabus subject route
router.get("/add", isLoggedIn, isAdmin, wrapasync((req, res) => {
  res.render("./electricalsyllabus/addsubject.ejs"); // Changed path to Electrical
}));

// Add a new subject to the Electrical syllabus
router.post("/add", isLoggedIn, isAdmin, wrapasync(async (req, res) => {
  const {
    semester,
    courseCode,
    subject,
    theoryHours,
    tutorialHours,
    practicalHours,
    credits,
  } = req.body;

  const syllabus = await ElectricalSyllabus.findOne({ department: "ELECTRICAL" }); // Changed to Electrical

  if (!syllabus) {
    return res.status(404).send("Syllabus not found");
  }

  const semIndex = syllabus.semesters.findIndex(
    (sem) => sem.semester === parseInt(semester)
  );

  if (semIndex === -1) {
    return res.status(404).send("Semester not found");
  }

  const newCourse = {
    courseCode,
    subject,
    theoryHours: parseInt(theoryHours),
    tutorialHours: parseInt(tutorialHours),
    practicalHours: parseInt(practicalHours),
    credits: parseInt(credits),
  };

  syllabus.semesters[semIndex].courses.push(newCourse);
  await syllabus.save();
  req.flash("success", "Added successfully!");

  return res.redirect("/electricalSyllabus"); // Changed route
}));

// Delete Electrical syllabus subject route
router.post("/delete", isLoggedIn, isAdmin, wrapasync(async (req, res) => {
  const { semester, courseCode } = req.body;

  const syllabus = await ElectricalSyllabus.findOne({ department: "ELECTRICAL" }); // Changed to Electrical

  if (!syllabus) {
    return res.status(404).send("Syllabus not found");
  }

  const sem = syllabus.semesters.find(
    (sem) => sem.semester === parseInt(semester)
  );

  if (!sem) {
    return res.status(404).send("Semester not found");
  }

  sem.courses = sem.courses.filter(
    (course) => course.courseCode !== courseCode
  );

  await syllabus.save();
  req.flash("success", "Deleted successfully!");
  return res.redirect("/electricalSyllabus"); // Changed route
}));

module.exports = router;
