const express = require("express"); 
const router=express.Router();
const ItListing = require("../models/itlisting.js");
const ItSyllabus = require("../models/itsyllabus.js");

const CpListing = require("../models/cplisting.js");
const CpSyllabus = require("../models/cpsyllabus.js");

const AutomobileListing = require("../models/automobilelisting.js");
const AutomobileSyllabus = require("../models/automobilesyllabus.js");

const CsdListing = require("../models/csdlisting.js");
const CsdSyllabus = require("../models/csdsyllabus.js");

const AiListing = require("../models/ailisting.js");
const AiSyllabus = require("../models/aisyllabus.js");

const EacListing = require("../models/eaclisting.js");
const EacSyllabus = require("../models/eacsyllabus.js");

const FptListing = require("../models/fptlisting.js");
const FptSyllabus = require("../models/fptsyllabus.js");

const DtListing = require("../models/dtlisting.js");
const DtSyllabus = require("../models/dtsyllabus.js");

const MechenicalListing = require("../models/mechenicallisting.js");
const MechenicalSyllabus = require("../models/mechenicalsyllabus.js");
const ElectricalListing = require("../models/electricallisting.js");
const ElectricalSyllabus = require("../models/electricalsyllabus.js");

const CivilListing = require("../models/civillisting.js");
const CivilSyllabus = require("../models/civilsyllabus.js");

const Timetable = require("../models/timetable.js");
const ItClassAndLeb = require("../models/itclassandleb.js");
const { stringify } = require("querystring");
const{isLoggedIn}=require("../middleware.js");





router.get("/add-class", async (req, res) => {
  try {
    const existingTimetables = await Timetable.find({}).lean();

    // Fetch syllabuses for all departments
    const [IT, CP,AI,CSD,MICHENICAL,CIVIL,FPT,DT,ELECTRICAL,EAC,AUTOMOBILE] = await Promise.all([
      ItSyllabus.findOne({}),
      AiSyllabus.findOne({}),
      CsdSyllabus.findOne({}),
      MechenicalSyllabus.findOne({}),
      CivilSyllabus.findOne({}),
      FptSyllabus.findOne({}),
      DtSyllabus.findOne({}),
      ElectricalSyllabus.findOne({}),
      EacSyllabus.findOne({}),
      AutomobileSyllabus.findOne({}),
      CpSyllabus.findOne({}),
    ]);

    // Extract subjects from each syllabus
    const extractSubjects = (syllabus) =>
      syllabus ? syllabus.semesters.flatMap(sem => sem.courses) : [];

    const subjects = [
      ...extractSubjects(IT),
      ...extractSubjects(CP),
      ...extractSubjects(AI),
      ...extractSubjects(CSD),
      ...extractSubjects(MICHENICAL),
      ...extractSubjects(CIVIL),
      ...extractSubjects(FPT),
      ...extractSubjects(DT),
      ...extractSubjects(ELECTRICAL),
      ...extractSubjects(EAC),
      ...extractSubjects(AUTOMOBILE),

    ];

    res.render("./timetable/addClass", { subjects, existingTimetables });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading subjects.");
  }
});



router.get("/get-subjects", async (req, res) => {
    const { branch, semester } = req.query;

    try {
        let syllabusModel;
        if (branch === "IT") syllabusModel = ItSyllabus;
        else if (branch === "CP") syllabusModel = CpSyllabus;
        else if (branch === "AI") syllabusModel = AiSyllabus;
        else if (branch === "CSD") syllabusModel = CsdSyllabus;
        else if (branch === "MECHANICAL") syllabusModel = MechanicalSyllabus;
        else if (branch === "CIVIL") syllabusModel = CivilSyllabus;
        else if (branch === "FPT") syllabusModel = FptSyllabus;
        else if (branch === "DT") syllabusModel = DtSyllabus;
        else if (branch === "ELECTRICAL") syllabusModel = ElectricalSyllabus;
        else if (branch === "EAC") syllabusModel = EacSyllabus;
        else if (branch === "AUTOMOBILE") syllabusModel = AutomobileSyllabus;
       
        else return res.json({ subjects: [] });

        const syllabus = await syllabusModel.findOne({ department: branch });
        if (!syllabus) return res.json({ subjects: [] });

        const semesterData = syllabus.semesters.find(s => s.semester == semester);
        if (!semesterData) return res.json({ subjects: [] });

        res.json({ subjects: semesterData.courses });
    } catch (error) {
        console.error("Error fetching subjects:", error);
        res.status(500).json({ subjects: [] });
    }
});


// Handle form submission
router.post("/add-class", async (req, res) => {
  let { branch, semester, section, subjects, batches } = req.body;

  // Ensure subjects is always an array
  if (!Array.isArray(subjects)) {
    subjects = [subjects];
  }



  // Fetch faculty based on subjects
  const itfaculty = await ItListing.find({ subjects: { $in: subjects } }).lean();
  
  // Fetch subject details including theoryHours, tutorialHours, and practicalHours
  const itsubjects = await ItSyllabus.find({ "semesters.courses.subject": { $in: subjects } }).lean();

    // Fetch faculty based on subjects
    const cpfaculty = await CpListing.find({ subjects: { $in: subjects } }).lean();
  
    // Fetch subject details including theoryHours, tutorialHours, and practicalHours
    const cpsubjects = await CpSyllabus.find({ "semesters.courses.subject": { $in: subjects } }).lean();







        // Fetch faculty based on subjects
        const csdfaculty = await CsdListing.find({ subjects: { $in: subjects } }).lean();
  
        // Fetch subject details including theoryHours, tutorialHours, and practicalHours
        const csdsubjects = await CsdSyllabus.find({ "semesters.courses.subject": { $in: subjects } }).lean();


            // Fetch faculty based on subjects
    const aifaculty = await AiListing.find({ subjects: { $in: subjects } }).lean();
  
    // Fetch subject details including theoryHours, tutorialHours, and practicalHours
    const aisubjects = await AiSyllabus.find({ "semesters.courses.subject": { $in: subjects } }).lean();


        // Fetch faculty based on subjects
        const civilfaculty = await CivilListing.find({ subjects: { $in: subjects } }).lean();
  
        // Fetch subject details including theoryHours, tutorialHours, and practicalHours
        const civilsubjects = await CivilSyllabus.find({ "semesters.courses.subject": { $in: subjects } }).lean();

            // Fetch faculty based on subjects
    const mechenicalfaculty = await MechenicalListing.find({ subjects: { $in: subjects } }).lean();
  
    // Fetch subject details including theoryHours, tutorialHours, and practicalHours
    const mechenicalsubjects = await MechenicalSyllabus.find({ "semesters.courses.subject": { $in: subjects } }).lean();

        // Fetch faculty based on subjects
        const fptfaculty = await FptListing.find({ subjects: { $in: subjects } }).lean();
  
        // Fetch subject details including theoryHours, tutorialHours, and practicalHours
        const fptsubjects = await FptSyllabus.find({ "semesters.courses.subject": { $in: subjects } }).lean();

            // Fetch faculty based on subjects
    const dtfaculty = await DtListing.find({ subjects: { $in: subjects } }).lean();
  
    // Fetch subject details including theoryHours, tutorialHours, and practicalHours
    const dtsubjects = await DtSyllabus.find({ "semesters.courses.subject": { $in: subjects } }).lean();

        // Fetch faculty based on subjects
        const electricalfaculty = await ElectricalListing.find({ subjects: { $in: subjects } }).lean();
  
        // Fetch subject details including theoryHours, tutorialHours, and practicalHours
        const electricalsubjects = await ElectricalSyllabus.find({ "semesters.courses.subject": { $in: subjects } }).lean();

            // Fetch faculty based on subjects
    const eacfaculty = await EacListing.find({ subjects: { $in: subjects } }).lean();
  
    // Fetch subject details including theoryHours, tutorialHours, and practicalHours
    const eacsubjects = await EacSyllabus.find({ "semesters.courses.subject": { $in: subjects } }).lean();

        // Fetch faculty based on subjects
        const automobilefaculty = await AutomobileListing.find({ subjects: { $in: subjects } }).lean();
  
        // Fetch subject details including theoryHours, tutorialHours, and practicalHours
        const automobilesubjects = await AutomobileSyllabus.find({ "semesters.courses.subject": { $in: subjects } }).lean();

        

  // Extract and structure the subject details
  const subjectDetails = {};
  
  itsubjects.forEach(syllabus => {
      syllabus.semesters.forEach(semester => {
          semester.courses.forEach(course => {
              if (subjects.includes(course.subject)) {
                  subjectDetails[course.subject] = {
                      theoryHours: course.theoryHours,
                      tutorialHours: course.tutorialHours,
                      practicalHours: course.practicalHours
                  };
              }
          });
      });
  });

  cpsubjects.forEach(syllabus => {
    syllabus.semesters.forEach(semester => {
        semester.courses.forEach(course => {
            if (subjects.includes(course.subject)) {
                subjectDetails[course.subject] = {
                    theoryHours: course.theoryHours,
                    tutorialHours: course.tutorialHours,
                    practicalHours: course.practicalHours
                };
            }
        });
    });
});

aisubjects.forEach(syllabus => {
  syllabus.semesters.forEach(semester => {
    semester.courses.forEach(course => {
      if (subjects.includes(course.subject)) {
        subjectDetails[course.subject] = {
          theoryHours: course.theoryHours,
          tutorialHours: course.tutorialHours,
          practicalHours: course.practicalHours
        };
      }
    });
  });
});

csdsubjects.forEach(syllabus => {
  syllabus.semesters.forEach(semester => {
    semester.courses.forEach(course => {
      if (subjects.includes(course.subject)) {
        subjectDetails[course.subject] = {
          theoryHours: course.theoryHours,
          tutorialHours: course.tutorialHours,
          practicalHours: course.practicalHours
        };
      }
    });
  });
});

mechenicalsubjects.forEach(syllabus => {
  syllabus.semesters.forEach(semester => {
    semester.courses.forEach(course => {
      if (subjects.includes(course.subject)) {
        subjectDetails[course.subject] = {
          theoryHours: course.theoryHours,
          tutorialHours: course.tutorialHours,
          practicalHours: course.practicalHours
        };
      }
    });
  });
});

civilsubjects.forEach(syllabus => {
  syllabus.semesters.forEach(semester => {
    semester.courses.forEach(course => {
      if (subjects.includes(course.subject)) {
        subjectDetails[course.subject] = {
          theoryHours: course.theoryHours,
          tutorialHours: course.tutorialHours,
          practicalHours: course.practicalHours
        };
      }
    });
  });
});

fptsubjects.forEach(syllabus => {
  syllabus.semesters.forEach(semester => {
    semester.courses.forEach(course => {
      if (subjects.includes(course.subject)) {
        subjectDetails[course.subject] = {
          theoryHours: course.theoryHours,
          tutorialHours: course.tutorialHours,
          practicalHours: course.practicalHours
        };
      }
    });
  });
});

dtsubjects.forEach(syllabus => {
  syllabus.semesters.forEach(semester => {
    semester.courses.forEach(course => {
      if (subjects.includes(course.subject)) {
        subjectDetails[course.subject] = {
          theoryHours: course.theoryHours,
          tutorialHours: course.tutorialHours,
          practicalHours: course.practicalHours
        };
      }
    });
  });
});

electricalsubjects.forEach(syllabus => {
  syllabus.semesters.forEach(semester => {
    semester.courses.forEach(course => {
      if (subjects.includes(course.subject)) {
        subjectDetails[course.subject] = {
          theoryHours: course.theoryHours,
          tutorialHours: course.tutorialHours,
          practicalHours: course.practicalHours
        };
      }
    });
  });
});

eacsubjects.forEach(syllabus => {
  syllabus.semesters.forEach(semester => {
    semester.courses.forEach(course => {
      if (subjects.includes(course.subject)) {
        subjectDetails[course.subject] = {
          theoryHours: course.theoryHours,
          tutorialHours: course.tutorialHours,
          practicalHours: course.practicalHours
        };
      }
    });
  });
});

automobilesubjects.forEach(syllabus => {
  syllabus.semesters.forEach(semester => {
    semester.courses.forEach(course => {
      if (subjects.includes(course.subject)) {
        subjectDetails[course.subject] = {
          theoryHours: course.theoryHours,
          tutorialHours: course.tutorialHours,
          practicalHours: course.practicalHours
        };
      }
    });
  });
});


  
  const itClassAndLab = await ItClassAndLeb.findOne();
  const classrooms = itClassAndLab ? itClassAndLab.classrooms : [];
  const laboratories = itClassAndLab ? itClassAndLab.laboratories : [];

    // NEW: Fetch all existing timetables for clash detection
    const existingTimetables = await Timetable.find({}).lean();
  
  // Render the EJS file and pass the required data
  res.render("timetable/timetable", { itfaculty,cpfaculty, aifaculty, csdfaculty, mechenicalfaculty, civilfaculty, fptfaculty, dtfaculty, electricalfaculty, eacfaculty, automobilefaculty,subjects, subjectDetails,classrooms,laboratories,branch, semester, section,batches,existingTimetables });
  
});

function cleanLectureField(field) {
if (Array.isArray(field)) {
    return field.find(value => value && value.trim() !== '') || '';
}
return field;
}





router.post('/save-timetable', async (req, res) => {
  try {
    const { branch, section, semester, schedule, batch, department } = req.body;
    
    // Define time slots and days for consistent data structure
    const timeSlots = ['09:00 - 10:00 AM', '10:00 - 11:00 AM', '11:00 - 12:00 PM', '12:00 - 1:00 PM', 'Lunch Break', '2:00 - 3:00 PM', '3:00 - 4:00 PM'];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Create a properly structured timetable array
    const timetableData = [];

       // NEW CODE - Server-side clash check with other timetables
       const existingTimetables = await Timetable.find({});

       const bookedFaculty = {};
       const bookedRooms = {};
       // Process existing timetables to determine booked resources
    existingTimetables.forEach(tt => {
      tt.schedule.forEach(scheduleItem => {
        const day = scheduleItem.day;
        const slot = scheduleItem.slot;
        
        scheduleItem.lectures.forEach(lecture => {
          if (lecture.faculty) {
            if (!bookedFaculty[lecture.faculty]) {
              bookedFaculty[lecture.faculty] = {};
            }
            if (!bookedFaculty[lecture.faculty][day]) {
              bookedFaculty[lecture.faculty][day] = {};
            }
            bookedFaculty[lecture.faculty][day][slot] = true;
          }
          
          if (lecture.locationNumber) {
            if (!bookedRooms[lecture.locationNumber]) {
              bookedRooms[lecture.locationNumber] = {};
            }
            if (!bookedRooms[lecture.locationNumber][day]) {
              bookedRooms[lecture.locationNumber][day] = {};
            }
            bookedRooms[lecture.locationNumber][day][slot] = true;
          }
        });
      });
    });
    
    
    
    
    // Log received data for debugging
    console.log("Received schedule data:", JSON.stringify(schedule, null, 2));
    
    // Helper function to clean lecture fields
    function cleanLectureField(value) {
      // Return empty string if value is null or undefined
      if (value === null || value === undefined) return '';
      
      // Convert to string, trim whitespace, and remove any potentially harmful characters
      return String(value).trim();
    }
    
    // Process each time slot and day in the schedule
    if (schedule) {
      Object.keys(schedule).forEach(slotIndex => {
        const slotIndexNum = parseInt(slotIndex);
        
        // Skip lunch break slot (index 4)
        if (slotIndexNum === 4) return;
        
        const timeSlot = timeSlots[slotIndexNum];
        
        Object.keys(schedule[slotIndex]).forEach(dayIndex => {
          const dayIndexNum = parseInt(dayIndex);
          const day = days[dayIndexNum];
          
          const slotData = schedule[slotIndex][dayIndex];
          
          // Check if there are lectures defined
          if (slotData && slotData.lectures) {
            const lectures = [];
            
            // Process each lecture entry
            Object.values(slotData.lectures).forEach(lecture => {
              // Only add lectures that have at least some data (subject is required)
              if (
                lecture && 
                lecture.subject &&
                (typeof lecture.subject === 'string' ? lecture.subject.trim() : String(lecture.subject).trim() !== '')
              ) {
                lectures.push({
                  batch: lecture.batch || '',
                  subject: lecture.subject || '',
                  type: lecture.type || '',
                  faculty: lecture.faculty || '',
                  locationType: lecture.locationType || '',
                  locationNumber: lecture.locationNumber || ''
                });
              }
            });
            
            // Only add slots that have at least one valid lecture
            if (lectures.length > 0) {
              timetableData.push({
                slot: timeSlot,
                day: day,
                lectures: lectures
              });
            }
          }
        });
      });
    }
    
    // Clean each lecture field before saving the timetable
    timetableData.forEach(day => {
      day.lectures.forEach(lec => {
        lec.batch = cleanLectureField(lec.batch);
        lec.subject = cleanLectureField(lec.subject);
        lec.type = cleanLectureField(lec.type);
        lec.faculty = cleanLectureField(lec.faculty);
        lec.locationType = cleanLectureField(lec.locationType);
        lec.locationNumber = cleanLectureField(lec.locationNumber);
      });
    });
    

    // Check for clashes
    for (const scheduleItem of timetableData) {
      const day = scheduleItem.day;
      const slot = scheduleItem.slot;
      
      for (const lecture of scheduleItem.lectures) {
        // Check faculty clash
        if (lecture.faculty && 
            bookedFaculty[lecture.faculty] && 
            bookedFaculty[lecture.faculty][day] && 
            bookedFaculty[lecture.faculty][day][slot]) {
          return res.status(400).send(`Faculty ${lecture.faculty} is already booked on ${day} during ${slot} in another timetable.`);
        }
        
        // Check room clash
        if (lecture.locationNumber && 
            bookedRooms[lecture.locationNumber] && 
            bookedRooms[lecture.locationNumber][day] && 
            bookedRooms[lecture.locationNumber][day][slot]) {
          return res.status(400).send(`${lecture.locationType === 'class' ? 'Room' : 'Lab'} ${lecture.locationNumber} is already booked on ${day} during ${slot} in another timetable.`);
        }
      }
    }
    console.log("Processed timetable data:", JSON.stringify(timetableData, null, 2));
    
    
    // Create and save the timetable document
    const timetable = new Timetable({
      branch,
      section,
      semester,
      schedule: timetableData
    });
    
    const savedTimetable = await timetable.save();
    console.log("Saved timetable with ID:", savedTimetable._id);
    req.flash("success", "add successfully!");
    res.redirect(`/timetable/select-timetable`); // Redirect to a success page
  } catch (error) {
    console.error("Error saving timetable:", error);
    res.status(500).send("Failed to save timetable: " + error.message);
  }
});




router.get('/select-timetable', async (req, res) => {
  try {
    const timetables = await Timetable.find({}, 'branch section semester');

    const branches = new Set();
    const sections = new Set();
    const semesters = new Set();

    timetables.forEach(t => {
      if (t.branch) branches.add(t.branch);
      if (t.section) sections.add(t.section);
      if (t.semester) semesters.add(t.semester);
    });

    res.render('timetable/selectTimetable', {
      branches: [...branches],
      sections: [...sections],
      semesters: [...semesters]
    });
  } catch (error) {
    console.error("Error loading select-timetable:", error);
    res.status(500).send("Server Error");
  }
});





router.get('/view-timetable', (req, res) => {
  console.log("Query parameters:", req.query); 
  const { branch, section, semester } = req.query;

  if (!branch || !section || !semester) {
    req.flash("error", "TimeTable not found!");
    return res.redirect("/timetable/select-timetable");
  }

  res.redirect(`/timetable/view-timetable/${branch.toUpperCase()}/${section.toUpperCase()}/${String(semester)}`);
});






router.get('/view-timetable/:branch/:section/:semester', async (req, res) => {
  try {
    let { branch, section, semester } = req.params;
    branch = branch.toUpperCase();
    section = section.toUpperCase();
    semester = String(semester);

    const timetable = await Timetable.findOne({ branch, section, semester });

    if (!timetable) {
      req.flash("error", "TimeTable not found!");
      return res.redirect("/timetable/select-timetable");
     
    }

    const timeSlots = [
      '09:00 - 10:00 AM',
      '10:00 - 11:00 AM',
      '11:00 - 12:00 PM',
      '12:00 - 1:00 PM',
      'Lunch Break',
      '2:00 - 3:00 PM',
      '3:00 - 4:00 PM'
    ];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const scheduleMap = {};
    days.forEach(day => {
      scheduleMap[day] = {};
      timeSlots.forEach(slot => {
        scheduleMap[day][slot] = [];
      });
    });

    timetable.schedule.forEach(entry => {
      if (entry.day && entry.slot && scheduleMap[entry.day] && scheduleMap[entry.day][entry.slot]) {
        scheduleMap[entry.day][entry.slot] = entry.lectures;
      }
    });

    res.render('timetable/viewTimetable', {
      branch,
      section,
      semester,
      timeSlots,
      days,
      scheduleMap,
      timetable
    });

  } catch (error) {
    console.error("Error fetching timetable:", error);
    res.status(500).send("Server Error");
  }
});

router.delete('/delete-timetable/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Timetable.findByIdAndDelete(id);
    req.flash("delete", "add successfully!");
    res.redirect('/timetable/select-timetable'); // Redirect to the timetable selection page
  } catch (error) {
    console.error("Error deleting timetable:", error);
    res.status(500).send("Failed to delete timetable: " + error.message);
  }
});

module.exports = router;