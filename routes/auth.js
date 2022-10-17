const { Router } = require("express");
const { check } = require("express-validator");

const { login, autenticarToken } = require("../controllers/auth");

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.get("/", [validarJWT, validarCampos], autenticarToken);

router.post(
  "/login",
  [
    check("correo", "El correo es obligatorio").isEmail(),
    check("contraseña", "La contraseña es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  login
);

module.exports = router;
