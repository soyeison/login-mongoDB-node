const { Router } = require("express");
const { check } = require("express-validator");

const {
  usuariosGet,
  usuariosPost,
  usuariosDelete,
  usuariosPut,
} = require("../controllers/usuarios");

const {
  emailExiste,
  esRoleValido,
  existeUsuarioPorId,
} = require("../helpers/db-validator");

const { validarCampos } = require("../middlewares/validar-campos");

const { validarJWT } = require("../middlewares/validar-jwt");

const { esAdminRole } = require("../middlewares/validar-roles");

const router = Router();

router.get("/", usuariosGet);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("correo", "El correo es obligatorio").isEmail(),
    check(
      "contraseña",
      "La contraseña debe tener mas de 6 caracteres"
    ).isLength({
      min: 6,
    }),
    check("rol").custom(esRoleValido),
    check("correo").custom(emailExiste),
    validarCampos,
  ],
  usuariosPost
);

router.put(
  "/:id",
  [
    check("id", "No es un id válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("rol").custom(esRoleValido),
    validarCampos,
  ],
  usuariosPut
);

router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un id válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuariosDelete
);

module.exports = router;
