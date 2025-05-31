const express=require('express');
const router=express.Router();
const ItClassAndLeb = require("../models/itclassandleb.js");
const wrapasync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/expressError.js");
const{isLoggedIn}=require("../middleware.js");





router.get("/",wrapasync (async (req, res) => {
    let data = await ItClassAndLeb.find();
    res.render("./classandleb/classandleb.ejs", { data });
  }));
  
  router.get("/new",isLoggedIn,wrapasync (async (req, res) => {
    res.render("./classandleb/classandlebNew.ejs");
  }));
  
  router.post("/",wrapasync (async (req, res) => {
    try {
      const { type, room_number, capacity } = req.body;
      let updateQuery;
  
      if (type === "Classroom") {
        updateQuery = { $push: { classrooms: { room_number, capacity } } };
      } else if (type === "Laboratory") {
        updateQuery = {
          $push: { laboratories: { lab_id: room_number, capacity } },
        };
      } else {
        return res.status(400).send("Invalid type");
      }
  
      await ItClassAndLeb.findOneAndUpdate({}, updateQuery, {
        upsert: true,
        new: true,
      });
      req.flash("success", "add successfully!");
      res.redirect("/classandleb"); // Redirect back to UI
    } catch (error) {
      console.error(error);
      res.status(500).send("Error adding data");
    }
  }));
  
  router.delete("/:id",isLoggedIn,wrapasync (async (req, res) => {
    try {
      let { id } = req.params;
      let { type } = req.body; // Type should be 'Classroom' or 'Laboratory'
  
      let updateQuery;
  
      if (type === "Classroom") {
        updateQuery = { $pull: { classrooms: { _id: id } } };
      } else if (type === "Laboratory") {
        updateQuery = { $pull: { laboratories: { _id: id } } };
      } else {
        return res.status(400).send("Invalid type specified.");
      }
  
      await ItClassAndLeb.findOneAndUpdate({}, updateQuery, { new: true });
      req.flash("success", "delete successfully!");
      res.redirect("/classandleb");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting entry");
    }
  }));
  module.exports = router;