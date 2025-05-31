



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

// CP Syllabus schema
const CPSyllabusSchema = new Schema({
  department: { type: String, required: true, default: "CP" },
  semesters: [SemesterSchema]
});

// Export the model
const CPSyllabus = mongoose.model('CPSyllabus', CPSyllabusSchema);

module.exports = CPSyllabus;