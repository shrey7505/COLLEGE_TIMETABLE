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

// Ai Syllabus schema
const AiSyllabusSchema = new Schema({
  department: { type: String, required: true, default: "Ai" },
  semesters: [SemesterSchema]
});

// Export the model
const AiSyllabus = mongoose.model('AiSyllabus', AiSyllabusSchema);

module.exports = AiSyllabus;