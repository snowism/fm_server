const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const conn = require("./connection");

// One model per collection
const Musicians = require("./models/musicians-model");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// connection code
mongoose.connect(conn.atlasURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// feedback to let us know we succeeded
mongoose.connection.on("connected", (err, res) => {
  console.log("Success! Connected to MongoDB");
});

// in case we fail
mongoose.connection.on("error", (err) => {
  console.log("Error connecting to MongoDB ", err);
});

// end connection code

// base

app.get("/", function (req, res) {
  res.send("<h1>Hello, </h1>");
});

app.get("/hi", function (req, res) {
  // do some work, call DB etc
  res.send("<h1>hello world</h1>");
});

// api routes
// create new routes using api - good RESTful practice
const router = express.Router();
app.use("/api", router);

// get all
router.get("/musicians", (req, res) => {
  console.log("musicians requested");
  Musicians.find().then(
    (musiciansArray) => {
      res.json(musiciansArray);
    },
    () => {
      res.json({ result: false });
    }
  );
});

// find and return a single user based upon id - not _id
router.get("/musicians/:id", (req, res) => {
  Musicians.findOne({ id: req.params.id }).then(
    (musiciansArray) => {
      res.json(musiciansArray);
    },
    () => {
      res.json({ result: false });
    }
  );
});

// delete

router.delete("/musicians/:id", (req, res) => {
  console.table(req.params);
  Musicians.deleteOne({ id: req.params.id }, function (err, result) {
    // res.json({ result: true });
    // res.send(err);
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

// CREATE new 

router.post("/musicians", (req, res) => {
  // create instance writer model

  var newmusician = new Musicians();
  var reactForm = req.body;

  // copy form data into instance. nice.

  Object.assign(newmusician, reactForm);

  // for debug only

  console.log(">>> ", reactForm);

  newmusician.save().then(
    (result) => {
      return res.json(result);
    },

    () => {
      return res.send("problem adding new writer");
    }
  );
});

// end CREATE new writer



// catch bad endpoints on the api route only
router.get("/*", (req, res) => {
  return res.json({ result: "not a valid endpoint" });
});

let PORT = 4000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
