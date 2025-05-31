const express = require("express");
const multer  = require('multer')
const eventRoutes = require('./routes/event.js');
const upload = multer({ dest: 'uploads/' })

const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const localstrategy = require("passport-local");
const User = require("./models/user.js");
const session = require("express-session");
var flash = require('connect-flash');

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");

const itlistingrouter = require("./routes/it/itlisting.js");
const cplistingrouter = require("./routes/cp/cplisting.js");
const itsyllabusrouter = require("./routes/it/itsyllabus.js");
const cpsyllabusrouter = require("./routes/cp/cpsyllabus.js");
const classandlebrouter = require("./routes/classandleb.js");
const timetablerouter = require("./routes/timetable.js");
const userrouter = require("./routes/user.js");

const ailistingrouter = require("./routes/ai/ailisting.js");
const aisyllabusrouter = require("./routes/ai/aisyllabus.js");

const dtlistingrouter = require("./routes/dt/dtlisting.js");
const dtsyllabusrouter = require("./routes/dt/dtsyllabus.js");

const civillistingrouter = require("./routes/civil/civillisting.js");
const civilsyllabusrouter = require("./routes/civil/civilsyllabus.js");

const mechenicallistingrouter = require("./routes/mechenical/mechenicallisting.js");
const mechenicalsyllabusrouter = require("./routes/mechenical/mechenicalsyllabus.js");

// 

const fptlistingrouter = require("./routes/fpt/fptlisting.js");
const fptsyllabusrouter = require("./routes/fpt/fptsyllabus.js");

const electricallistingrouter = require("./routes/electrical/electricallisting.js");
const electricalsyllabusrouter = require("./routes/electrical/electricalsyllabus.js");




const eaclistingrouter = require("./routes/eac/eaclisting.js");
const eacsyllabusrouter = require("./routes/eac/eacsyllabus.js");

const automobilelistingrouter = require("./routes/automobile/automobilelisting.js");
const automobilesyllabusrouter = require("./routes/automobile/automobilesyllabus.js");

const csdlistingrouter = require("./routes/csd/csdlisting.js");
const csdsyllabusrouter = require("./routes/csd/csdsyllabus.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));app.engine("ejs", ejsMate);

mongoose
  .connect("mongodb://127.0.0.1:27017/aditproject")
  .then(() => console.log("Connected!"));

const port = 7505;
app.listen(port, () => {
  console.log("your website is start on port no", port);
});



const sessionoptions = {
  secret: "thisshouldbeasecret",
  resave: false, 
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
}





app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy()); // Uses passport-local-mongoose

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success=req.flash("success")
  res.locals.error=req.flash("error")
  res.locals.currentUser=req.user
  next();
});

const Event = require('./models/event'); // Adjust the path if needed

app.get("/home", async (req, res) => {
  try {
    const events = await Event.find();

    // Render the home view and pass the events to it
    res.render("home", { events });
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).send("Internal Server Error");
  }
});






// it listing route...
app.use("/itlisting", itlistingrouter);
app.use(eventRoutes);

app.use("/cplisting", cplistingrouter);
app.use("/ailisting", ailistingrouter);
app.use("/csdlisting", csdlistingrouter);
app.use("/automobilelisting", automobilelistingrouter);
app.use("/dtlisting", dtlistingrouter);
app.use("/civillisting", civillistingrouter);
app.use("/mechenicallisting", mechenicallistingrouter);
app.use("/fptlisting", fptlistingrouter);
app.use("/eaclisting", eaclistingrouter);
app.use("/electricallisting", electricallistingrouter);

// it subjects route...

app.use("/itsyllabus", itsyllabusrouter);
app.use("/cpsyllabus", cpsyllabusrouter);
app.use("/aisyllabus", aisyllabusrouter);
app.use("/dtsyllabus", dtsyllabusrouter);
app.use("/civilsyllabus", civilsyllabusrouter);
app.use("/mechenicalsyllabus", mechenicalsyllabusrouter);
app.use("/fptsyllabus", fptsyllabusrouter);
app.use("/electricalsyllabus", electricalsyllabusrouter);
app.use("/eacsyllabus", eacsyllabusrouter);
app.use("/automobilesyllabus", automobilesyllabusrouter);
app.use("/csdsyllabus", csdsyllabusrouter);
// it class and leb routes...

app.use("/classandleb", classandlebrouter);

// Render the Add Class form
app.use("/timetable", timetablerouter);
// user route
app.use("/",userrouter)

//ending midelwere...

// 404 handler
app.use((req, res) => {
  res
    .status(404)
    .render("404.ejs", { statusCode: 404, message: "Page not found" });
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("404.ejs", { message, statusCode });
});
