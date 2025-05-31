const express = require('express');
const router = express.Router();
const Event = require('../models/event'); // Ensure this path is correct
const { isLoggedIn, isAdmin } = require("../middleware.js");


// Show the admin page with the form to add events
router.get('/admin/events',isLoggedIn, isAdmin, (req, res) => {
  res.render('admin-events'); // Ensure you have an 'admin-events.ejs' for the form
});

// Handle POST request to add a new event
router.post('/admin/events',isLoggedIn, isAdmin, async (req, res) => {
  const { title, date, message } = req.body;

  try {
    // Create a new event using the data from the form
    const newEvent = new Event({
      title,
      date,
      message,
    });

    // Save the event to the database
    await newEvent.save();

    // Redirect back to the home page or wherever you want
    res.redirect('/home');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding event');
  }
});

// Route: GET /events/show
router.get('/events/show', async (req, res) => {
    try {
      const events = await Event.find();
  
      if (!events || events.length === 0) {
        return res.status(404).send('No events found');
      }
  
      // Render the hero.ejs file directly with events data
      res.render("includes/hero", { events });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching events');
    }
  });

  router.delete('/events/:id',isLoggedIn, isAdmin, async (req, res) => {
    try {
      // Find and delete the event by ID
      const deletedEvent = await Event.findByIdAndDelete(req.params.id);
  
      if (!deletedEvent) {
        return res.status(404).send('Event not found');
      }
  
      // Redirect back to the home page after deleting
      res.redirect('/home'); // or wherever you want to redirect after deletion
    } catch (err) {
      console.error("Error deleting event:", err);
      res.status(500).send("Failed to delete event");
    }
  });
  
  
  
  
  
  

module.exports = router;
