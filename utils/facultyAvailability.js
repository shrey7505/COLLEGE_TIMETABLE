const Timetable = require('../models/timetable.js'); // update path accordingly

app.get('/create-timetable', async (req, res) => {
  const allTimetables = await Timetable.find({});
  const usedSlots = {};

  // Flatten timetable data
  allTimetables.forEach(t => {
    t.schedule.forEach(slot => {
      slot.lectures.forEach(lec => {
        const key = `${slot.day}-${slot.slot}`;
        if (!usedSlots[key]) usedSlots[key] = { faculties: [], locations: [] };

        usedSlots[key].faculties.push(lec.faculty);
        usedSlots[key].locations.push(`${lec.locationType}-${lec.locationNumber}`);
      });
    });
  });

  res.render('timetableForm', {
    // your other props
    usedSlots: JSON.stringify(usedSlots),
  });
});
