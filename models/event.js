const mongoose = require('mongoose');

// Define Event Schema
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, // Removes leading/trailing whitespaces
  },
  date: {
    type: Date,
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true, // Removes leading/trailing whitespaces
  },
}, { timestamps: true }); // This will automatically add createdAt and updatedAt fields

// Create and export the Event model
module.exports = mongoose.model('Event', eventSchema);
