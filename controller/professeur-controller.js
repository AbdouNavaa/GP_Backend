const APIFeatures = require("../utils/apiFeatures");
const Matiere = require("../models/matiere");
const Professeur = require("../models/professeur");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Cours = require("../models/cours");
const CoursReponse = require("./json-response/cours-response");
const professeur = require("../models/professeur");
const User = require("../auth/models/user");
exports.getProfesseurs = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.id) filter = { cours: req.params.id };
  const features = new APIFeatures(
    Professeur.find().populate([
      {
        path: "matieres",
        populate: { path: "categorie" },
      },
    ]),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .pagination();
  const professeurs = await features.query;
  res.status(200).json({
    status: "success",
    professeurs,
  });
});

exports.deleteAllProfesseurs = catchAsync(async (req, res, next) => {
  await Professeur.deleteMany();
  res.status(200).json({
    status: "success",
    message: "all professeurs is deleted",
  });
});

exports.addProfesseur = catchAsync(async (req, res, next) => {
  const data = req.body;
  let professeur = new Professeur({
    nom: req.body.nom,
    prenom: req.body.prenom,
    mobile: req.body.mobile,
    email: req.body.email,
    matieres: req.body.matieres,
  });
  professeur = await professeur.save();
  res.status(200).json({
    status: "success",
    data: {
      professeur,
    },
  });
});

exports.updateProfesseur = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;

  const professeur = await Professeur.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!professeur) {
    return next(new AppError("No professeur found with that ID", 404));
  }
  res.status(201).json({
    status: "success",
    message: "professeur update successfully",
    professeur: professeur,
  });
});

exports.deleteProfesseur = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const professeur = await Professeur.findByIdAndDelete(id);
  if (!professeur) {
    return next(new AppError("No professeur found with that ID", 404));
  }
  const user = await User.findByIdAndDelete(professeur.user);
  let ms = "";
  if (user) {
    ms = "user and ";
  }

  res.status(200).json({
    status: "success",
    message: ms + `professeur ssucceffily delete`,
  });
});
exports.getProfCours = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const cours = await Cours.find({ professeur: id }).populate([
    {
      path: "professeur",
    },
    {
      path: "matiere",
      populate: {
        path: "categorie",
      },
    },
  ]);
  const data = coure_respone(cours);
  res.status(200).json({
    status: "success",
    data,
  });
});
exports.getProfCoursNon = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const cours = await Cours.find({ professeur: id, isSigne: false }).populate([
    {
      path: "professeur",
    },
    {
      path: "matiere",
      populate: {
        path: "categorie",
      },
    },
  ]);
  const data = coure_respone(cours);
  res.status(200).json({
    status: "success",
    data,
  });
});
///Get Professeur By ID-----------------------------------------------------------------------------------------
exports.getProfesseurById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const professeur = await Professeur.findById(id).populate([
    {
      path: "matieres",
      populate: { path: "categorie" },
    },
  ]);
  if (!professeur) {
    return next(new AppError("No professeur found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    professeur,
  });
});
///Get Professeur By Email-----------------------------------------------------------------------------------------

exports.getProfesseurEmail = catchAsync(async (req, res, next) => {
  const email = req.params.email;
  const professeur = await Professeur.findOne({
    email: email,
  }).populate([
    {
      path: "matieres",
      populate: { path: "categorie" },
    },
  ]);
  if (!professeur) {
    return next(new AppError("No professeur found with that EMAIL", 404));
  }
  res.status(200).json({
    status: "success",
    professeur,
  });
});
exports.addMatiereToProfesseus = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const professeur = await Professeur.updateMany(
    {
      _id: id,
    },
    {
      $addToSet: {
        matieres: req.body.matieres,
      },
    }
  );
  const matiere = await Matiere.findById(req.body.matiere);
  const matiere_prof = professeur.matieres;

  if (!professeur) {
    return next(new AppError("No professeur found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    professeur,
    matiere,
  });
});

//Add One Matiere To Professeur     -----------------------------------------------------------------------------------------------------
exports.deleteOneMatProf = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const idM = req.params.idM;
  const Oldprofesseur = await Professeur.findById(id);
  if (!Oldprofesseur) {
    return next(new AppError("No professeur found with that ID", 404));
  }
  const professeur = await Professeur.updateMany(
    {
      _id: id,
    },
    {
      $pull: {
        matieres: idM,
      },
    }
  );

  res.status(200).json({
    status: "success",
    message: "matiere deleted successfully",
    professeur,
  });
});
// Add Cours to Professeur--------------------------------------------------------------------------------------
exports.addCoursToProf = catchAsync(async (req, res, next) => {
  const data = req.body;
  const professeur = await Professeur.findById(req.params.id);
  const matiere = await Matiere.findById(req.body.matiere);
  if (!professeur) {
    return next(new AppError("No professeur found with that ID", 404));
  }
  if (!matiere) {
    return next(new AppError("No matiere found with that ID", 404));
  }
  const cours = await Cours.create({
    professeur: req.params.id,
    matiere: req.body.matiere,//Modify by abdou
    types: req.body.type,
    heures: req.body.heures,
    date: req.body.date,
  });
  res.status(201).json({
    status: "success",

    cours,
  });
});
//----------------------------------------------------------------------------------------------

//---------------------function-------------------------------------------
const coure_respone = (cours) => {
  let coursLL = [];
  let heuresTV = 0;
  let sommeTV = 0;
  let professeur = "";
  let email = "";
  let id = "";
  cours.forEach((elm) => {
    let somme = 0;
    let prix = 0;
    let line = " ";
    let sm = 0;
    let CM = 0;
    let TD = 0;
    let TP = 0;
    let isSigne = 0;
    let isPaid = 0;
    prix = elm.matiere.categorie.prix;
    elm.types.forEach((elm) => {
      line = line + elm.name + " : " + elm.nbh + ", ";
      if (elm.name == "CM") {
        CM = elm.nbh;
        elm.nbh = elm.nbh;
      }
      if (elm.name == "TD") {
        TD = elm.nbh;
        elm.nbh = ((elm.nbh * 2) / 3).toFixed(2);
      }
      if (elm.name === "TP") {
        TP = elm.nbh;
        elm.nbh = ((elm.nbh * 2) / 3).toFixed(2);
      }
      sm = sm + elm.nbh;
      somme = sm * prix;
    });
    let cours = new CoursReponse(
      elm._id,
      elm.matiere.name,
      elm.professeur.nom + " " + elm.professeur.prenom,
      elm.professeur._id,
      elm.professeur.email,
      line,
      sm,
      elm.date,
      elm.debit,
      CM,
      TD,
      TP,
      somme,
      prix,
      elm.isSigne,
      elm.isPaid
    );
    coursLL.push(cours);
    professeur = elm.professeur.nom + " " + elm.professeur.prenom;
    email = elm.professeur.email;
    id = elm.professeur._id;
    sommeTV = sommeTV + somme;
    heuresTV = sm + heuresTV;
  });
  let data = {
    countLL: coursLL.length,
    heuresTV,
    sommeTV,
    professeur,
    email,
    id,
    coursLL,
  };
  return data;
};
