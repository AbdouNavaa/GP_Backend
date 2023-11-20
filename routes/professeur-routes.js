const express = require("express");
const Professeur = require("../models/professeur");

const Cours = require("../models/cours");
const professeurController = require("../controller/professeur-controller");
const authController = require("../auth/controller/auth-controller");
const app = express();
const routerPro = express.Router();
routerPro.use((req, res, next) => {
  console.log(`hello from professeur!!!`);
  next();
});
routerPro
  .route("/")
  .get(
    authController.protect,
    authController.restricTo("admin", "responsable"),
    professeurController.getProfesseurs
  )
  .post(professeurController.addProfesseur);
routerPro
  .route("/:email/email")
  .get(authController.protect, professeurController.getProfesseurEmail);

routerPro
  .route("/:id")
  .get(
    authController.protect,
    authController.restricTo("admin", "professeur"),
    professeurController.getProfesseurById
  )
  .delete(
    authController.protect,
    authController.restricTo("admin"),
    professeurController.deleteProfesseur
  )
  .post(
    authController.protect,
    authController.restricTo("admin", "professeur"),
    professeurController.addMatiereToProfesseus
  )
  .patch(
    authController.protect,
    authController.restricTo("admin", "professeur"),
    professeurController.updateProfesseur
  );

routerPro
  .route("/:id/cours-non")
  .get(
    authController.protect,
    authController.restricTo("admin", "professeur"),
    professeurController.getProfCoursNon
  );
routerPro
  .route("/:id/cours")
  .get(
    authController.protect,
    authController.restricTo("admin", "professeur"),
    professeurController.getProfCours
  )
  .post(
    authController.protect,
    authController.restricTo("admin", "professeur"),
    professeurController.addCoursToProf
  );
routerPro
  .route("/:id/matiere")
  .get(
    authController.protect,
    authController.restricTo("admin", "professeur"),
    professeurController.addMatiereToProfesseus
  );
routerPro
  .route("/:id/:idM")
  .delete(
    authController.protect,
    authController.restricTo("admin", "professeur"),
    professeurController.deleteOneMatProf
  );
module.exports = routerPro;
