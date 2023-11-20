const APIFeatures = require("../utils/apiFeatures");
const Matiere = require("../models/matiere");
const Professeur = require("../models/professeur");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Categorie = require("../models/categorie");
exports.getMatieres = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.id) filter = { cours: req.params.id };
  const features = new APIFeatures(
    Matiere.find()

       .populate({
         path: "categorie",
        select: "prix",
        select: "code",
    }), //Modify by abdou
    /*  .populate([
      {
        path: "categorie",
        select: "prix",
      },
    ]), */
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .pagination();
  const matieres = await features.query;

  res.status(200).json({
    status: "success",
    matieres,
  });
});
exports.deleteAllMatieres = catchAsync(async (req, res, next) => {
  await Matiere.deleteMany();
  res.status(200).json({
    status: "success",
    message: "all matieres is deleted",
  });
});
exports.getMatieresProf = catchAsync(async (req, res, next) => {
  let filter = {};
  const professeurs = await Professeur.find({
    matieres: req.params.id,
  });

  res.status(200).json({
    status: "success",

    professeurs,
  });
});

exports.addMatiere = catchAsync(async (req, res, next) => {
  const data = req.body;
  const categorie = await Categorie.findById(req.body.categorie);
  if (!categorie) {
    return res.status(400).json({
      status: "fail",
      message: "wrong categorie ID",
    });
  }
  const Oldmatiere = await Matiere.findOne({ name: req.body.name });
  if (Oldmatiere) {
    return res.status(400).json({
      status: "fail",
      message: "the matiere name existe before",
    });
  }
  const matiere = await Matiere.create({
    name: req.body.name,
    semestres: req.body.semestres,
    description: req.body.description,
    semestre: req.body.semestre,
    categorie: req.body.categorie,
    taux: categorie.prix,
  });//Modify by abdou

  res.status(200).json({
    status: "success",
    data: {
      matiere: matiere,
    },
  });
});

exports.updateMatiere = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  const matiere = await Matiere.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!matiere) {
    return next(new AppError("No Matiere found with that ID", 404));
  }
  res.status(201).json({
    status: "success",
    matiere: matiere,
  });
});

exports.deleteMatiere = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const matiere = await Matiere.findByIdAndDelete(id);
  if (!matiere) {
    return next(new AppError("No Matiere found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    message: "matiere ssucceffily delete",
  });
});
exports.getMatiere = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const matiere = await Matiere.findById(id).populate([
    {
      path: "categorie",
      select: "prix name",
    },
  ]);
  if (!matiere) {
    return next(new AppError("No Matiere found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    matiere,
  });
});

exports.getMatiereStats = catchAsync(async (req, res, next) => {
  const stats = await Matiere.aggregate([
    {
      $match: { prixParHeur: { $gte: 2000 } },
    },
    {
      $group: {
        _id: "$categorie",
        numMatieres: { $sum: 1 },
        avgPrixParHeur: { $avg: "$prixParHeur" },
        minPrixParHeur: { $min: "$prixParHeur" },
        maxPrixParHeur: { $max: "$prixParHeur" },
      },
    },
  ]);
  if (!stats) {
    return next(new AppError("aggregate fail", 404));
  }
  res.status(200).json({
    status: "success",
    message: stats,
  });
});
