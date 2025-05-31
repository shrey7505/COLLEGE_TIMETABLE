const express = require("express");
const router = express.Router();
const ItListing = require("../../models/itlisting.js");
const ItSyllabus = require("../../models/itsyllabus.js");
const Timetable = require("../../models/timetable.js");
const wrapasync = require("../../utils/wrapasync.js");
const ItClassAndLeb = require("../../models/itclassandleb.js");
const{isLoggedIn}=require("../../middleware.js");


// router.get("/",wrapasync (async (req, res) => {
//   // try {
//   //   const syllabusId = "67e7e85fa334510e73525cdd";  // <-- Move ID to variable for clarity
//   //   const syllabusData = await ItSyllabus.findById(syllabusId);

//   //   if (!syllabusData) {
//   //     return res.status(404).send("Syllabus document not found.");
//   //   }

//   //   const semesters = syllabusData.syllabus.semesters;
//   //   res.render('./itsyllabus/itsyllabusindex.ejs', { semesters });

//   // } catch (err) {
//   //   console.error("Error fetching syllabus data:", err.message);
//   //   res.status(500).send("Server error while fetching syllabus data.");
//   // }

//   ItSyllabus.findOne({ department: "IT" })
//     .then((syllabus) => {
//       res.render("./itsyllabus/itsyllabusindex.ejs", {
//         semesters: syllabus.semesters,
//       });
//     })
//     .catch((err) => {
//       console.error("Error fetching syllabus:", err);
//       res.status(500).send("Internal Server Error");
//     });
// }));

router.get("/", isLoggedIn,wrapasync(async (req, res) => {
  const syllabus = await ItSyllabus.findOne({ department: "IT" });

  if (!syllabus) {
    return res.status(404).send("Syllabus not found");
  }

  return res.render("./itsyllabus/itsyllabusindex.ejs", {
    semesters: syllabus.semesters,
  });
}));


router.get("/add",isLoggedIn,wrapasync ((req, res) => {
  res.render("./itsyllabus/addsubject.ejs"); // Render the form
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

  const syllabus = await ItSyllabus.findOne({ department: "IT" });

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

  return res.redirect("/itSyllabus");
}));


router.post("/delete",isLoggedIn, wrapasync(async (req, res) => {
  const { semester, courseCode } = req.body;

  const syllabus = await ItSyllabus.findOne({ department: "IT" });

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
  return res.redirect("/itSyllabus");
}));




module.exports = router;
