// this file is for the initialize the data or add data in mongodb...
const mongoose = require("mongoose");
const itsyllabus = require("./itsyllabus.js");

const itdata = require("./itdata.js");
const ItListing = require("../models/itlisting.js");
const ItSyllabus = require("../models/itsyllabus.js");


const aidata = require("./aidata.js");
const AiListing = require("../models/ailisting.js");
const AiSyllabus = require("../models/aisyllabus.js");
const aisyllabus = require("./aisyllabus.js");

const automobiledata = require("./automobiledata.js");
const AutomobileListing = require("../models/automobilelisting.js");
const AutomobileSyllabus = require("../models/automobilesyllabus.js");
const automobilesyllabus = require("./automobilesyllabus.js");

const civildata = require("./civildata.js");
const CivilListing = require("../models/civillisting.js");
const CivilSyllabus = require("../models/civilsyllabus.js");
const civilsyllabus = require("./civilsyllabus.js");

const dtdata = require("./dtdata.js");
const DtListing = require("../models/dtlisting.js");
const DtSyllabus = require("../models/dtsyllabus.js");
const dtsyllabus = require("./dtsyllabus.js");

const eacdata = require("./eacdata.js");
const EacListing = require("../models/eaclisting.js");
const EacSyllabus = require("../models/eacsyllabus.js");
const eacsyllabus = require("./eacsyllabus.js");

const electricaldata = require("./electricaldata.js");
const ElectricalListing = require("../models/electricallisting.js");
const ElectricalSyllabus = require("../models/electricalsyllabus.js");
const electricalsyllabus = require("./electricalsyllabus.js");

const mechenicaldata = require("./mechenicaldata.js");
const MechenicalListing = require("../models/mechenicallisting.js");
const MechenicalSyllabus = require("../models/mechenicalsyllabus.js");
const mechenicalsyllabus = require("./mechenicalsyllabus.js");

const fptdata = require("./fptdata.js");
const FptListing = require("../models/fptlisting.js");
const FptSyllabus = require("../models/fptsyllabus.js");
const fptsyllabus = require("./fptsyllabus.js");



const csddata = require("./csddata.js");
const CSDListing = require("../models/csdlisting.js");
const CSDSyllabus = require("../models/csdsyllabus.js");
const csdsyllabus = require("./csdsyllabus.js");



const ItClassAndLeb = require("../models/itclassandleb.js");
const itclassandleb = require("./itclassandleb.js");



const cpsyllabus = require("./cpsyllabus.js");
const CPSyllabus = require("../models/cpsyllabus.js");
const cpdata = require("./cpdata.js");
const CPListing = require("../models/cplisting.js");

async function main() {
  try {
    // Connect with proper database name and await the connection
    await mongoose.connect("mongodb://127.0.0.1:27017/aditproject"
, {
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
    });
    console.log("Connected to MongoDB!");
    
    // Only proceed to init DB after successful connection
    await initDB();
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit if connection fails
  }
}

const initDB = async () => {
  try {

    //----------------------------------------------------------------------------------------------------------
    await ItListing.deleteMany({});

    itdata.itdata = itdata.itdata.map(obj => ({
      ...obj,
      owner: "67ff31a54b2d29d2457265b1"
    }));

    
    await ItListing.insertMany(itdata.itdata);
    console.log("IT listings data was added to database...");
    //----------------------------------------------------------------------------------------------------------
  await CPListing.deleteMany({});

    cpdata.cpdata = cpdata.cpdata.map(obj => ({
      ...obj,
      owner: "67ff31a54b2d29d2457265b1"
    }));

    
    await CPListing.insertMany(cpdata.cpdata);
    console.log("cp listings data was added to database...");
    //----------------------------------------------------------------------------------------------------------
    await AiListing.deleteMany({});

    aidata.aidata = aidata.aidata.map(obj => ({
      ...obj,
      owner: "67ff31a54b2d29d2457265b1"
    }));

    
    await AiListing.insertMany(aidata.aidata);
    console.log("ai listings data was added to database...");
    //----------------------------------------------------------------------------------------------------------

    await CSDListing.deleteMany({});

    csddata.csddata = csddata.csddata.map(obj => ({
      ...obj,
      owner: "67ff31a54b2d29d2457265b1"
    }));

    
    await CSDListing.insertMany(csddata.csddata);
    console.log("CSD listings data was added to database...");
    //----------------------------------------------------------------------------------------------------------
    
    
    
    
    
    
    
    
    
    await AutomobileListing.deleteMany({});

    automobiledata.automobiledata = automobiledata.automobiledata.map(obj => ({
      ...obj,
      owner: "67ff31a54b2d29d2457265b1"
    }));

    
    await AutomobileListing.insertMany(automobiledata.automobiledata);
    console.log("Automobile listings data was added to database...");
    //----------------------------------------------------------------------------------------------------------
    await CivilListing.deleteMany({});

    civildata.civildata = civildata.civildata.map(obj => ({
      ...obj,
      owner: "67ff31a54b2d29d2457265b1"
    }));

    
    await CivilListing.insertMany(civildata.civildata);
    console.log("Civil listings data was added to database...");
    //----------------------------------------------------------------------------------------------------------
    await DtListing.deleteMany({});

    dtdata.dtdata = dtdata.dtdata.map(obj => ({
      ...obj,
      owner: "67ff31a54b2d29d2457265b1"
    }));

    
    await DtListing.insertMany(dtdata.dtdata);
    console.log("DT listings data was added to database...");
    //----------------------------------------------------------------------------------------------------------
    await ElectricalListing.deleteMany({});

    electricaldata.electricaldata = electricaldata.electricaldata.map(obj => ({
      ...obj,
      owner: "67ff31a54b2d29d2457265b1"
    }));

    
    await ElectricalListing.insertMany(electricaldata.electricaldata);
    console.log("Electrical listings data was added to database...");
    //----------------------------------------------------------------------------------------------------------
    await EacListing.deleteMany({});

    eacdata.eacdata = eacdata.eacdata.map(obj => ({
      ...obj,
      owner: "67ff31a54b2d29d2457265b1"
    }))
    
    await EacListing.insertMany(eacdata.eacdata);
    console.log("Eac listings data was added to database...");
    //----------------------------------------------------------------------------------------------------------
    await FptListing.deleteMany({});

    fptdata.fptdata = fptdata.fptdata.map(obj => ({
      ...obj,
      owner: "67ff31a54b2d29d2457265b1"
    }));

    
    await FptListing.insertMany(fptdata.fptdata);
    console.log("Fpt listings data was added to database...");
    //----------------------------------------------------------------------------------------------------------
    await MechenicalListing.deleteMany({});

    mechenicaldata.mechenicaldata = mechenicaldata.mechenicaldata.map(obj => ({
      ...obj,
      owner: "67ff31a54b2d29d2457265b1"
    }));

    
    await MechenicalListing.insertMany(mechenicaldata.mechenicaldata);
    console.log("Mechenical listings data was added to database...");
    //----------------------------------------------------------------------------------------------------------














    
//----------------------------------------------------------------------------------------------------------
    await ItSyllabus.deleteMany({});
    await ItSyllabus.insertMany(itsyllabus.itsyllabus);
    console.log("IT syllabus data was added to database...");

    await CPSyllabus.deleteMany({});
    await CPSyllabus.insertMany(cpsyllabus.cpsyllabus);
    console.log("cp syllabus data was added to database...");

    await AiSyllabus.deleteMany({});
    await AiSyllabus.insertMany(aisyllabus.aisyllabus);
    console.log("ai syllabus data was added to database...");


    await CSDSyllabus.deleteMany({});
    await CSDSyllabus.insertMany(csdsyllabus.csdsyllabus);
    console.log("csd syllabus data was added to database...");





    await DtSyllabus.deleteMany({});
    await DtSyllabus.insertMany(dtsyllabus.dtsyllabus);
    console.log("dt syllabus data was added to database...");

    await AutomobileSyllabus.deleteMany({});
    await AutomobileSyllabus.insertMany(automobilesyllabus.automobilesyllabus);
    console.log("automobile syllabus data was added to database...");

    await CivilSyllabus.deleteMany({});
    await CivilSyllabus.insertMany(civilsyllabus.civilsyllabus);
    console.log("Civil syllabus data was added to database...");

 

    await EacSyllabus.deleteMany({});
    await EacSyllabus.insertMany(eacsyllabus.eacsyllabus);
    console.log("eac syllabus data was added to database...");

    await MechenicalSyllabus.deleteMany({});
    await MechenicalSyllabus.insertMany(mechenicalsyllabus.mechenicalsyllabus);
    console.log("mechenical syllabus data was added to database...");

    await ElectricalSyllabus.deleteMany({});
    await ElectricalSyllabus.insertMany(electricalsyllabus.electricalsyllabus);
    console.log("electrical syllabus data was added to database...");

    await FptSyllabus.deleteMany({});
    await FptSyllabus.insertMany(fptsyllabus.fptsyllabus);
    console.log("fpt syllabus data was added to database...");





    await ItClassAndLeb.deleteMany({});
    await ItClassAndLeb.insertMany(itclassandleb.itclassandleb);
    console.log("IT classroom and lab data was added to database...");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

// Call the main function to start the process
main();