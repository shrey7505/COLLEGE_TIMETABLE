// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// // Course schema with _id for each subject
// const CourseSchema = new Schema({
//   courseCode: String,
//   subject: String,
//   theoryHours: Number,
//   tutorialHours: Number,
//   practicalHours: Number,
//   credits: Number
// }, { _id: true });  // 💥 Ensure each subject has its own ID

// const SemesterSchema = new Schema({
//   semester: Number,
//   courses: [CourseSchema]  // List of subjects
// });

// const ItSyllabusSchema = new Schema({
//   syllabus: {
//     semesters: [SemesterSchema]
//   }
// });

// const ItSyllabus = mongoose.model('ItSyllabus', ItSyllabusSchema);
// module.exports = ItSyllabus;



const mongoose = require('mongoose');
const { Schema } = mongoose;

// Course schema
const CourseSchema = new Schema({
  courseCode: { type: String, required: true },
  subject: { type: String, required: true },
  theoryHours: { type: Number, default: 0 },
  tutorialHours: { type: Number, default: 0 },
  practicalHours: { type: Number, default: 0 },
  credits: { type: Number, required: true }
});

// Semester schema
const SemesterSchema = new Schema({
  semester: { type: Number, required: true },
  courses: [CourseSchema]  // List of subjects
});

// IT Syllabus schema
const ItSyllabusSchema = new Schema({
  department: { type: String, required: true, default: "IT" },
  semesters: [SemesterSchema]
});

// Export the model
const ItSyllabus = mongoose.model('ItSyllabus', ItSyllabusSchema);

module.exports = ItSyllabus;