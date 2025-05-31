const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CSDListingSchema = new Schema({
  image: { 
    url: {
      type: String,
      default: "https://cdn.pixabay.com/photo/2017/07/18/23/23/user-2517433_1280.png",
      set: v => v === "" ? "https://cdn.pixabay.com/photo/2017/07/18/23/23/user-2517433_1280.png" : v
    },
    filename: String
  },
  name: { type: String },
  designation: { type: String },
  qualifications: { type: [String] },
  experience: {
    academics: { type: Number },
    industry: { type: Number }
  },
  contact: {
    emails: { type: [String] },
    whatsapp: { type: String, required: false }
  },
  subjects:
   { type: [String], 
    required: true
   } ,
   owner: {
    type: Schema.Types.ObjectId,
    ref: "User" // References the "User" collection
  }
});

const CSDListing = mongoose.model("CSDListing", CSDListingSchema);
module.exports = CSDListing;
