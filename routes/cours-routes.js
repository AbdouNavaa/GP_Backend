const express = require("express");
const courController = require("../controller/cours-controller");
const authController = require("../auth/controller/auth-controller");
const CoursRouter = express.Router();
CoursRouter.route("/")
  .get(
    authController.protect,
    authController.restricTo("admin", "responsable"),
    courController.getCours
  )
  .post(authController.protect, courController.addCours);
CoursRouter.route("/notpaid").get(
  authController.protect,
  authController.restricTo("admin"),
  courController.getNotPaidCours
);
CoursRouter.route("/signe").patch(courController.signeAllCours);
CoursRouter.route("/total").get(
  authController.protect,
  authController.restricTo("admin"),
  courController.TotalPeyement
);
CoursRouter.route("/paid").get(courController.getPaidCours);
CoursRouter.route("/:id/cours").post(courController.getAllCoursProf);
CoursRouter.route("/:id/signe").patch(courController.signeCours);

CoursRouter.route("/:id")
  .delete(authController.protect, courController.deleteCours)
  .get(courController.getOneCours)
  .patch(authController.protect, courController.updateCours);

module.exports = CoursRouter;
