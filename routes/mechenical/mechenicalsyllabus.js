const express = require("express");
const router = express.Router();
// const MechenicalListing = require("../../models/mechenicallisting.js");
const MechenicalSyllabus = require("../../models/mechenicalsyllabus.js");
const Timetable = require("../../models/timetable.js");
const wrapasync = require("../../utils/wrapasync.js");
const ItClassAndLeb = require("../../models/itclassandleb.js");
const { isLoggedIn, isAdmin } = require("../../middleware.js");

// Mechenical syllabus index route
router.get("/", isLoggedIn, wrapasync(async (req, res) => {
  const syllabus = await MechenicalSyllabus.findOne({ department: "MECHENICAL" });

  if (!syllabus) {
    return res.status(404).send("Syllabus not found");
  }

  return res.render("./mechenicalsyllabus/mechenicalsyllabusindex.ejs", {
    semesters: syllabus.semesters,
  });
}));

// Add Mechenical syllabus subject route
router.get("/add", isLoggedIn, isAdmin, wrapasync((req, res) => {
  res.render("./mechenicalsyllabus/addsubject.ejs");
}));

// Add a new subject to the Mechenical syllabus
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

  const syllabus = await MechenicalSyllabus.findOne({ department: "MECHENICAL" });

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

  return res.redirect("/mechenicalsyllabus");
}));

// Delete Mechenical syllabus subject route
router.post("/delete", isLoggedIn, isAdmin, wrapasync(async (req, res) => {
  const { semester, courseCode } = req.body;

  const syllabus = await MechenicalSyllabus.findOne({ department: "MECHENICAL" });

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
  return res.redirect("/mechenicalsyllabus");
}));

module.exports = router;