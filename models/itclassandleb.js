const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItClassAndLebSchema = new Schema({
    classrooms: [
        {
          room_number: { 
            type: Number, 
            required: true, 
            unique: true,  
          },
          capacity: { 
            type: Number, 
            default: 80 
          }
        }
      ],
      laboratories: [
        {
          lab_id: { 
            type: String, 
            required: true, 
            unique: true, 
            },
          capacity: { 
            type: Number, 
            default: 50 
          }
        }
      ]
    });
     
const ItClassAndLeb = mongoose.model("ItClassAndLeb", ItClassAndLebSchema);
module.exports = ItClassAndLeb;