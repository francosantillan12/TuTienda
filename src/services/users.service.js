import mongoose from "mongoose";
import UserRepository from "../repositories/user.repository.js";

class UsersService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  getAll() {
    return this.userRepository.getAll({}, { select: "-password" });
  }

  getById(uid) {
    if (!mongoose.Types.ObjectId.isValid(uid)) {
      const error = new Error("ID inválido");
      error.statusCode = 400;
      throw error;
    }

    return this.userRepository.getById(uid, { select: "-password" });
  }

  update(uid, data) {
    if (!mongoose.Types.ObjectId.isValid(uid)) {
      const error = new Error("ID inválido");
      error.statusCode = 400;
      throw error;
    }

    const { first_name, last_name, age, email, role, cart } = data;

    const update = {};
    if (first_name !== undefined) update.first_name = first_name;
    if (last_name !== undefined) update.last_name = last_name;
    if (age !== undefined) update.age = age;
    if (email !== undefined) update.email = email;
    if (role !== undefined) update.role = role;
    if (cart !== undefined) update.cart = cart;

    return this.userRepository.update(uid, update);
  }

  delete(uid) {
    if (!mongoose.Types.ObjectId.isValid(uid)) {
      const error = new Error("ID inválido");
      error.statusCode = 400;
      throw error;
    }

    return this.userRepository.delete(uid);
  }
}

export default UsersService;