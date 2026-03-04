import crypto from "crypto";
import UserRepository from "../repositories/user.repository.js";
import { enviarResetPasswordPorMail } from "./mailing.service.js";
import { createHash, isValidPassword } from "../utils.js";

class SessionsService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  forgotPassword(email) {
    if (!email) {
      const error = new Error("Falta el email");
      error.statusCode = 400;
      throw error;
    }

    // Por seguridad: siempre respondemos OK aunque no exista
    return this.userRepository.getByEmail(email)
      .then(function (usuario) {
        if (!usuario) {
          return { status: "ok", message: "Si el email existe, se enviará un enlace." };
        }

        const token = crypto.randomBytes(32).toString("hex");
        const expira = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
        const link = `${process.env.BASE_URL}/reset-password/${token}`;

        return this.userRepository.setResetToken(email, token, expira)
          .then(function () {
            return enviarResetPasswordPorMail(usuario.email, link);
          })
          .then(function () {
            return { status: "ok", message: "Si el email existe, se enviará un enlace." };
          }.bind(this));
      }.bind(this));
  }

  resetPassword(token, newPassword) {
    if (!newPassword) {
      const error = new Error("Falta newPassword");
      error.statusCode = 400;
      throw error;
    }

    return this.userRepository.getByResetTokenValido(token)
      .then(function (usuario) {
        if (!usuario) {
          const error = new Error("Token inválido o expirado");
          error.statusCode = 400;
          throw error;
        }

        const esLaMisma = isValidPassword(newPassword, usuario.password);
        if (esLaMisma) {
          const error = new Error("No podés usar la misma contraseña anterior");
          error.statusCode = 400;
          throw error;
        }

        return this.userRepository.update(usuario._id, { password: createHash(newPassword) })
          .then(function () {
            return this.userRepository.clearResetToken(usuario._id);
          }.bind(this))
          .then(function () {
            return { status: "ok", message: "Contraseña actualizada correctamente" };
          });
      }.bind(this));
  }
}

export default SessionsService;