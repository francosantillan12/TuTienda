import UsuarioModel from "../../model/usuario.model.js";

class UserDAO {
  async getAll(filtro = {}, opciones = {}) {
    const { sort = {}, skip = 0, limit = 0, select = "-password" } = opciones;

    return await UsuarioModel.find(filtro)
      .select(select)
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async getById(id, opciones = {}) {
    const { select = "-password" } = opciones;
    return await UsuarioModel.findById(id).select(select);
  }

  async getByEmail(email, opciones = {}) {
    const { select = "" } = opciones; // ojo: en login a veces necesitás password
    return await UsuarioModel.findOne({ email: email }).select(select);
  }

  async create(datos) {
    return await UsuarioModel.create(datos);
  }

  async update(id, datos) {
    return await UsuarioModel.findByIdAndUpdate(id, datos, { new: true }).select(
      "-password"
    );
  }

  async delete(id) {
    return await UsuarioModel.findByIdAndDelete(id);
  }

  // 🔁 Reset password helpers (según tu sessions.router.js)
  async setResetToken(email, token, expira) {
    return await UsuarioModel.findOneAndUpdate(
      { email: email },
      { resetToken: token, resetTokenExp: expira },
      { new: true }
    );
  }

  async getByResetTokenValido(token) {
    return await UsuarioModel.findOne({
      resetToken: token,
      resetTokenExp: { $gt: new Date() },
    });
  }

  async clearResetToken(userId) {
    return await UsuarioModel.findByIdAndUpdate(
      userId,
      { resetToken: null, resetTokenExp: null },
      { new: true }
    );
  }
}

export default UserDAO;