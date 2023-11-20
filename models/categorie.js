const mongoose = require("mongoose");
const schema = mongoose.Schema;
const categorieSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "categorie is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    prix: {
      type: Number,
      required: [true, "prix is required"],
      default: 100,
      min: 100,
      max: 900,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Categorie", categorieSchema);
