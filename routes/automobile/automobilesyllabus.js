const express = require("express");
const router = express.Router();
const AutomobileListing = require("../../models/automobilelisting.js"); // Replaced with Automobile-specific model
const AutomobileSyllabus = require("../../models/automobilesyllabus.js"); // Updated for Automobile syllabus
const Timetable = require("../../models/timetable.js");
const wrapasync = require("../../utils/wrapasync.js");
const ItClassAndLeb = require("../../models/itclassandleb.js"); // Adjust if you have Automobile-specific class/lab model
const { isLoggedIn } = require("../../middleware.js");

// Automobile syllabus index route
router.get("/", isLoggedIn, wrapasync(async (req, res) => {
  const syllabus = await AutomobileSyllabus.findOne({ department: "AUTOMOBILE" });

  if (!syllabus) {
    return res.status(404).send("Syllabus not found");
  }

  return res.render("./automobilesyllabus/automobilesyllabusindex.ejs", {
    semesters: syllabus.semesters,
  });
}));

// Add Automobile syllabus subject route
router.get("/add", isLoggedIn, wrapasync((req, res) => {
  res.render("./automobilesyllabus/addsubject.ejs");
}));

// Add a new subject to the Automobile syllabus
router.post("/add", wrapasync(async (req, res) => {
  const {
    semester,
    courseCode,
    subject,
    theoryHours,
    tutorialHours,
    practicalHours,
    credits,
  } = req.body;

  const syllabus = await AutomobileSyllabus.findOne({ department: "AUTOMOBILE" });

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

  return res.redirect("/automobileSyllabus");
}));

// Delete Automobile syllabus subject route
router.post("/delete", isLoggedIn, wrapasync(async (req, res) => {
  const { semester, courseCode } = req.body;

  const syllabus = await AutomobileSyllabus.findOne({ department: "AUTOMOBILE" });

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
  return res.redirect("/automobileSyllabus");
}));

module.exports = router;
