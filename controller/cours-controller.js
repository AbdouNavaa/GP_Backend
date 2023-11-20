const APIFeatures = require("../utils/apiFeatures");
const Cours = require("../models/cours");
const Professeur = require("../models/professeur");
const Matiere = require("../models/matiere");
const JSONCours = require("./json-response/cours-response");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const CoursReponse = require("./json-response/cours-response");
const TotalResponse = require("./json-response/total-response");
exports.getCours = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.id) filter = { cours: req.params.id };
  //EXECUTE QUERY
  const features = new APIFeatures(
    Cours.find(filter).populate([
      {
        path: "professeur",
      },
      {
        path: "matiere",
        populate: {
          path: "categorie",
        },
      },
    ]),

    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .pagination();
  const cours = await features.query;
  const data = coure_respone(cours);
  res.status(200).json({
    status: "success",
    data,
  });
});//Modify by abdou

exports.getOneCours = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const cours = await Cours.findById(id);
  if (!cours) {
    return next(new AppError("No cours found with that ID", 404));
  }
  res.status(200).json({
    status: "success",

    cours,
  });
});

exports.addCours = catchAsync(async (req, res, next) => {
  const data = req.body;
  const professeur = await Professeur.findById(req.body.professeur);
  const matiere = await Matiere.findById(req.body.matiere);
  if (!professeur) {
    return next(new AppError("No professeur found with that ID", 404));
  }
  if (!matiere) {
    return next(new AppError("No matiere found with that ID", 404));
  }
  const sommeDateCoure = await Cours.findOne({
    date: req.body.date,
    debit: req.body.debit,
    professeur: req.body.professeur,
  }).populate([
    {
      path: "professeur",
    },
  ]);
  if (sommeDateCoure) {
    return next(new AppError("2 cours in samme date to one professeur!", 404));
  }

  let type = req.body.types;
  nbh = 0;
  nbh_sm = 0;
  type.forEach((e) => {
    if (e.name == "CM") {
      nbh = nbh + e.nbh;
    }
    if (e.name == "TD" || e.name == "TP") {
      nbh = nbh + (e.nbh * 2) / 3;
    }
    nbh_sm = nbh + nbh_sm;
  });
  const cours = await Cours.create({
    types: req.body.types,
    tauxHoreure: nbh.toFixed(2),
    sommeUM: nbh.toFixed(2) * matiere.taux,
    date: req.body.date,
    debit: req.body.debit,
    professeur: req.body.professeur,
    matiere: req.body.matiere,
  });

  const professeurs = await Professeur.find();
  professeurs.forEach((el) => {
    reload_prof_function(el);
  });

  res.status(201).json({
    status: "success",

    cours,
  });
});
exports.signeCours = async (req, res, next) => {
  const id = req.params.id;
  const cours = await Cours.findByIdAndUpdate(
    id,
    {
      isSigne: true,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    cours,
  });
};
exports.signeAllCours = async (req, res, next) => {
  const id = req.params.id;
  const all_cours = await Cours.find({ isSigne: false });
  all_cours.forEach(async (elm) => {
    await Cours.findByIdAndUpdate(
      elm._id,
      {
        isSigne: true,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  });
  res.status(200).json({
    status: "success",
    message: "all cours signe",
  });
};
exports.updateCours = async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  const professeur = await Professeur.findById(req.body.professeur);
  const matiere = await Matiere.findById(req.body.matiere);
  if (!professeur) {
    return next(new AppError("No professeur found with that ID", 404));
  }
  if (!matiere) {
    return next(new AppError("No matiere found with that ID", 404));
  }
  const sommeDateCoure = await Cours.findOne({
    date: req.body.date,
    debit: req.body.debit,
    professeur: req.body.professeur,
  }).populate([
    {
      path: "professeur",
    },
  ]);
  const sommeDateCoure1 = await Cours.findById(id).populate([
    {
      path: "professeur",
    },
  ]);
  if (
    sommeDateCoure &&
    sommeDateCoure1 &&
    !sommeDateCoure1._id.equals(sommeDateCoure._id)
  ) {
    return next(new AppError("2 cours in samme date to one professeur!", 404));
  }
  const cours = await Cours.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!cours) {
    return next(new AppError("No cours found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      cours: cours,
      sommeDateCoure,
    },
  });
};

exports.deleteCours = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const cours = await Cours.findByIdAndDelete(id);
  if (!cours) {
    return next(new AppError("No cours found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    message: "cours ssucceffily delete",
  });
});
exports.getNotPaidCours = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const cours = await Cours.aggregate([
    {
      $match: {
        isPaid: false,
      },
    },
    {
      $group: {
        _id: "professeur",
        nbH: { $sum: "$heures" },
      },
    },
  ]);

  res.status(200).json({
    status: "success",

    count: cours.length,
    cours,
  });
});
exports.getPaidCours = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const cours = await Cours.find().populate([
    {
      path: "professeur",
    },
    {
      path: "matiere",
    },
  ]);

  res.status(200).json({
    status: "success",
    cours,
  });
});

exports.getAllCoursProf = catchAsync(async (req, res, next) => {
  let cours = [];
  let data = {};
  const professeur = await Professeur.findById(req.params.id);
  if (!professeur) {
    return next(new AppError("No professeur found with that ID", 404));
  }
  //total non paid ---------------------------------------------------------------------
  if (!req.body.debit && !req.body.fin) {
    cours = await Cours.find({
      professeur: req.params.id,
      isPaid: false,
    }).populate([
      {
        path: "matiere",
        populate: {
          path: "categorie",
        },
      },
    ]);
  } else {
    //total beetwen intervell temps--------------------------------------------------------------------
    cours = await Cours.find({
      professeur: req.params.id,
      date: { $gte: req.body.debit, $lte: req.body.fin },

      isPaid: false,
    }).populate([
      {
        path: "matiere",
        populate: {
          path: "categorie",
        },
      },
    ]);
  }
  data = coure_respone(cours);
  res.status(200).json({
    status: "success",
    data,
  });
});

//get total payement profs cours -------------------------------------------------
exports.TotalPeyement = catchAsync(async (req, res, next) => {
  const profsseurs = await Professeur.find();
  let embti_profsseurs = [];
  let Total = [];
  const cours = await Cours.find({
    isPaid: false,
  }).populate([
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
  profsseurs.forEach(async (elem) => {
    console.log("------------------------------------------");
    let ex = false;
    let cour = [];
    cours.forEach((el) => {
      if (el.professeur.email == elem.email) {
        ex = true;
        console.log(el.professeur.email);
        cour.push(el);
      }
    });
    if (!ex) {
      embti_profsseurs.push(elem);
    }
    let data = coure_respone1(cour);
    Total.push(data);
  });

  Total.forEach((el) => {
    if (el.professeur == "") {
    }
  });
  res.status(200).json({
    status: "success",
    embti_profsseurs,
  });
});
// reload_prof_function-------------------------------------------------------------------------
const reload_prof_function = async (professeur) => {
  const cours = await Cours.find({ professeur: professeur._id });
  somme = 0;
  nbh = 0;
  nbc = 0;
  cours.forEach((element) => {
    somme = somme + element.sommeUM;
    nbh = nbh + element.tauxHoreure;
    nbc = nbc + 1;
  });
  await Professeur.findByIdAndUpdate(
    professeur._id,
    {
      nbc: nbc,
      nbh: nbh,
      sommeUM: somme,
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

//---------------FUNCTION----------------------------------------------------------

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
//---------------FUNCTION2----------------------------------------------------------

const coure_respone1 = (cours, professeurs) => {
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
    professeur = elm.professeur.nom + " " + elm.professeur.prenom;
    id = elm.professeur._id;
    email = elm.professeur.email;
    coursLL.push(cours);
    professeur, email, id;
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
  };

  return data;
};
