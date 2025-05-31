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

// Fpt Syllabus schema
const FptSyllabusSchema = new Schema({
  department: { type: String, required: true, default: "FPT" },
  semesters: [SemesterSchema]
});

// Export the model
const FptSyllabus = mongoose.model('FptSyllabus', FptSyllabusSchema);

module.exports = FptSyllabus;