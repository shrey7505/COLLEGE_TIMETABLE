const express = require("express");
const router = express.Router();
const AiListing = require("../../models/ailisting.js"); // If needed, replace with AI-specific model
const AiSyllabus = require("../../models/aisyllabus.js"); // This can remain as it's used for syllabus
const Timetable = require("../../models/timetable.js");
const wrapasync = require("../../utils/wrapasync.js");
const ItClassAndLeb = require("../../models/itclassandleb.js"); // This might be adjusted to AiClassAndLeb if needed
const { isLoggedIn,isAdmin } = require("../../middleware.js");

// AI syllabus index route
router.get("/", isLoggedIn, wrapasync(async (req, res) => {
  const syllabus = await AiSyllabus.findOne({ department: "AI" }); // Change department to AI

  if (!syllabus) {
    return res.status(404).send("Syllabus not found");
  }

  return res.render("./aisyllabus/aisyllabusindex.ejs", {
    semesters: syllabus.semesters,
  });
}));

// Add AI syllabus subject route
router.get("/add", isLoggedIn,isAdmin, wrapasync((req, res) => {
  res.render("./aisyllabus/addsubject.ejs"); // Render the form for adding a new subject
}));

// Add a new subject to the syllabus
router.post("/add",isLoggedIn,isAdmin, wrapasync(async (req, res) => {
  const {
    semester,
    courseCode,
    subject,
    theoryHours,
    tutorialHours,
    practicalHours,
    credits,
  } = req.body;

  const syllabus = await AiSyllabus.findOne({ department: "AI" }); // Change department to AI

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

  return res.redirect("/aiSyllabus"); // Change route to AI syllabus
}));

// Delete AI syllabus subject route
router.post("/delete", isLoggedIn,isAdmin, wrapasync(async (req, res) => {
  const { semester, courseCode } = req.body;

  const syllabus = await AiSyllabus.findOne({ department: "AI" }); // Change department to AI

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
  return res.redirect("/aiSyllabus"); // Change route to AI syllabus
}));

module.exports = router;
