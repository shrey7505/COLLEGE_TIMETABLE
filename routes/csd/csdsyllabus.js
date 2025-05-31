const express = require("express");
const router = express.Router();
const CsdListing = require("../../models/csdlisting.js");
const CsdSyllabus = require("../../models/csdsyllabus.js");
const Timetable = require("../../models/timetable.js");
const wrapasync = require("../../utils/wrapasync.js");
const ItClassAndLeb = require("../../models/itclassandleb.js");
const { isLoggedIn } = require("../../middleware.js");

// Get all CSD semesters and courses
router.get("/", isLoggedIn, wrapasync(async (req, res) => {
  const syllabus = await CsdSyllabus.findOne({ department: "CSD" });

  if (!syllabus) {
    return res.status(404).send("Syllabus not found");
  }

  return res.render("./csdsyllabus/csdsyllabusindex.ejs", {
    semesters: syllabus.semesters,
  });
}));

// Render add subject form
router.get("/add", isLoggedIn, wrapasync((req, res) => {
  res.render("./csdsyllabus/addsubject.ejs");
}));

// Add a new subject to CSD syllabus
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

  const syllabus = await CsdSyllabus.findOne({ department: "CSD" });

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

  return res.redirect("/csdSyllabus");
}));

// Delete a subject from CSD syllabus
router.post("/delete", isLoggedIn, wrapasync(async (req, res) => {
  const { semester, courseCode } = req.body;

  const syllabus = await CsdSyllabus.findOne({ department: "CSD" });

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
  return res.redirect("/csdSyllabus");
}));

module.exports = router;
