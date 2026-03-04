import UserDAO from "../dao/mongo/user.dao.js";

class UserRepository {
  constructor() {
    this.dao = new UserDAO();
  }

  getAll(filtro, opciones) {
    return this.dao.getAll(filtro, opciones);
  }

  getById(id, opciones) {
    return this.dao.getById(id, opciones);
  }

  getByEmail(email, opciones) {
    return this.dao.getByEmail(email, opciones);
  }

  create(datos) {
    return this.dao.create(datos);
  }

  update(id, datos) {
    return this.dao.update(id, datos);
  }

  delete(id) {
    return this.dao.delete(id);
  }

  // 🔁 Reset password helpers
  setResetToken(email, token, expira) {
    return this.dao.setResetToken(email, token, expira);
  }

  getByResetTokenValido(token) {
    return this.dao.getByResetTokenValido(token);
  }

  clearResetToken(userId) {
    return this.dao.clearResetToken(userId);
  }
}

export default UserRepository;