const mongoose = require("mongoose");
const Categorie = require("../models/categorie");

const matiereSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "matiere nom is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    categorie: {
      type: mongoose.Schema.ObjectId,
      ref: "Categorie",
      required: true,
    },
    taux: {
      type: Number,
    },
 
    semestres: [
      {
        name: {
          type: String,
          select: true,
          values: [
            "S1",
            "S2",
            "S3",
            "S4",
            "S5",
            "S6",
            "MS1",
            "MS2",
            "MS3",
            "MS4",
          ],
        },
        code_EM: {
          type: String,
          select: true,
          unique: true,
        },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

matiereSchema.pre(["save", "update"], async function (next) {
  const categorie = await Categorie.findById(this.categorie);
  let categorie_code = "";
  if (categorie) {
    let nb_matiere_categorie = await this.constructor
      .find({ categorie: this.categorie })
      .count();
    let categorie_elements = categorie.name.split(" ");
    if (!categorie_elements[1]) {
      categorie_code = categorie_elements[0].substr(0, 4).toLocaleUpperCase();
    } else if (categorie_elements[1] && !categorie_elements[2]) {
      categorie_code =
        categorie_elements[0].substr(0, 2).toLocaleUpperCase() +
        categorie_elements[1].substr(0, 1).toLocaleUpperCase();
    } else {
      categorie_elements.forEach((element) => {
        categorie_code =
          categorie_code + element.substr(0, 1).toLocaleUpperCase();
      });
      console.log(categorie_code);
    }
    this.semestres.forEach((e) => {
      e.code_EM =
        categorie_code + e.name.substr(1) + "1" + nb_matiere_categorie;
      console.log(e.code_EM);
    });
   
  }
  next();
});









module.exports = mongoose.model("Matiere", matiereSchema);
