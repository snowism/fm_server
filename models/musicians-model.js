const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MusiciansSchema = new Schema(
  {
    name: String,
    album: String,
    id: String,
    filepath: String,
    debut: String,
    members: String,
  },
  {
    timestamps: true,
  }
);

// singular capitalized name for the mongo collection - Writer
module.exports = mongoose.model("Musician", MusiciansSchema);
