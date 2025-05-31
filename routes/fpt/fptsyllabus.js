const express = require("express");
const router = express.Router();
const FptListing = require("../../models/fptlisting.js"); // Changed from DtListing to FptListing
const FptSyllabus = require("../../models/fptsyllabus.js"); // Changed from DtSyllabus to FptSyllabus
const Timetable = require("../../models/timetable.js");
const wrapasync = require("../../utils/wrapasync.js");
const ItClassAndLeb = require("../../models/itclassandleb.js"); // Keep as is unless FPT has its own
const { isLoggedIn, isAdmin } = require("../../middleware.js");

// FPT syllabus index route
router.get("/", isLoggedIn, wrapasync(async (req, res) => {
  const syllabus = await FptSyllabus.findOne({ department: "FPT" });

  if (!syllabus) {
    return res.status(404).send("Syllabus not found");
  }

  return res.render("./fptsyllabus/fptsyllabusindex.ejs", {
    semesters: syllabus.semesters,
  });
}));

// Add FPT syllabus subject route
router.get("/add", isLoggedIn, isAdmin, wrapasync((req, res) => {
  res.render("./fptsyllabus/addsubject.ejs");
}));

// Add a new subject to the FPT syllabus
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

  const syllabus = await FptSyllabus.findOne({ department: "FPT" });

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

  return res.redirect("/fptSyllabus");
}));

// Delete FPT syllabus subject route
router.post("/delete", isLoggedIn, isAdmin, wrapasync(async (req, res) => {
  const { semester, courseCode } = req.body;

  const syllabus = await FptSyllabus.findOne({ department: "FPT" });

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
  return res.redirect("/fptSyllabus");
}));

module.exports = router;
