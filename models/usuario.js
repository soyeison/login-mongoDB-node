const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
  nombre: {
    type: String,
    require: [true, "El nombre es obligatorio"],
  },
  correo: {
    type: String,
    require: [true, "El correo es obligatorio"],
  },
  contraseña: {
    type: String,
    require: [true, "La contraseña es obligatoria"],
  },
  img: {
    type: String,
  },
  rol: {
    type: String,
    require: true,
    enum: ["ADMIN_ROLE", "USER_ROLE"],
  },
  estado: {
    type: Boolean,
    default: true,
  },
});

UsuarioSchema.methods.toJSON = function () {
  const { __v, contraseña, _id, ...data } = this.toObject();
  data.uid = _id;
  return data;
};

module.exports = model("Usuario", UsuarioSchema);
