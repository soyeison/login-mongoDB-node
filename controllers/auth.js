const { response, json } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req, res = response) => {
  const { correo, contraseña } = req.body;

  try {
    //Verificar si el usuario existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario / Contraseña no son correctos - Correo",
      });
    }

    //Verificar si el usuario está activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Usuario / Contraseña no son correctos - Usuario inactivo",
      });
    }

    //Verificar la contraseña
    const validContraseña = bcryptjs.compareSync(
      contraseña,
      usuario.contraseña
    );
    if (!validContraseña) {
      return res.status(400).json({
        msg: "Usuario / Contraseña con son correctos - Contraseña",
      });
    }

    //Generar el JWT
    const token = await generarJWT(usuario._id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Comuniquese con el administrador",
    });
  }
};

module.exports = {
  login,
};
