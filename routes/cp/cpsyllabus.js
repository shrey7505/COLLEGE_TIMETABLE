const express = require("express");
const router = express.Router();
const CpListing = require("../../models/cplisting.js");
const CpSyllabus = require("../../models/cpsyllabus.js");
const Timetable = require("../../models/timetable.js");
const wrapasync = require("../../utils/wrapasync.js");
const ItClassAndLeb = require("../../models/itclassandleb.js");
const{isLoggedIn}=require("../../middleware.js");


router.get("/", isLoggedIn,wrapasync(async (req, res) => {
  const syllabus = await CpSyllabus.findOne({ department: "CP" });

  if (!syllabus) {
    return res.status(404).send("Syllabus not found");
  }

  return res.render("./cpsyllabus/cpsyllabusindex.ejs", {
    semesters: syllabus.semesters,
  });
}));


router.get("/add",isLoggedIn,wrapasync ((req, res) => {
  res.render("./cpsyllabus/addsubject.ejs"); // Render the form
}));

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

  const syllabus = await CpSyllabus.findOne({ department: "CP" });

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
  req.flash("success", "add successfully!");

  return res.redirect("/cpSyllabus");
}));


router.post("/delete",isLoggedIn, wrapasync(async (req, res) => {
  const { semester, courseCode } = req.body;

  const syllabus = await CpSyllabus.findOne({ department: "CP" });

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
  req.flash("success", "delete successfully!");
  return res.redirect("/cpSyllabus");
}));




module.exports = router;
