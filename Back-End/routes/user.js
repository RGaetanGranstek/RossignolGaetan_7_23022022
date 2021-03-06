// création du routeur des login
const express = require("express");
const router = express.Router();
// importation du auth (login)
const auth = require("../middleware/auth");
// importation de multer
const multer = require("../middleware/multer-config");
// controlleur pour associer les fonctions aux différentes routes
const userCtrl = require("../controllers/user");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

// supprimer un compte existant dans la base de donnée
router.delete("/delete/:id", auth, multer, userCtrl.deleteUtilisateur);

// Information de profil
router.get("/profil/:id", auth, multer, userCtrl.userProfil);

// Information de tous les profils
router.get("/profil/", auth, multer, userCtrl.userProfilAll);

// mettre à jour un compte existant dans la base de donnée
router.put("/update/:id", auth, multer, userCtrl.updateUtilisateur);

module.exports = router;
