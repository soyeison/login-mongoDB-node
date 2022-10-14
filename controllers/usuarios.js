const { response } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/usuario");

const usuariosGet = async (req, res = response) => {
  const { desde = 0, limite = 5 } = req.query;
  const query = { estado: true };

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);
  res.json({ total, usuarios });
};

const usuariosPost = async (req, res = response) => {
  const { nombre, correo, contraseña, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, contraseña, rol });

  //Encriptar contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.contraseña = bcryptjs.hashSync(contraseña, salt);

  //Guardamos en DB
  await usuario.save();
  res.json(usuario);
};

const usuariosPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, correo, contraseña, ...data } = req.body;

  const usuario = await Usuario.findByIdAndUpdate(id, data, { new: true });

  res.json(usuario);
};

const usuariosDelete = async (req, res = response) => {
  const { id } = req.params;

  const usuario = await Usuario.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );
  res.json(usuario);
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
};
