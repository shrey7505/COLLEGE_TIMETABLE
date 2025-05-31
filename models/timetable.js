const mongoose = require('mongoose');

// Define a schema for the timetable
const lectureSchema = new mongoose.Schema({
    batch: String,
    subject: String,
    type: String,
    faculty: String,
    locationType: String,
    locationNumber: String,
  });
  
  const timetableSlotSchema = new mongoose.Schema({
    slot: String, // e.g., "09:00 - 10:00 AM"
    day: String, // e.g., "Monday"
    lectures: [lectureSchema],
  });
  
  const timetableSchema = new mongoose.Schema({
    branch: String,
    section: String,
    semester: String,
    schedule: [timetableSlotSchema],
  });
  

// Create a model
const Timetable = mongoose.model('Timetable', timetableSchema);

module.exports = Timetable; // Export the model

