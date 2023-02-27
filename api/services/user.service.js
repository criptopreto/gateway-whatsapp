"use strict";
const Model = require("../models/user");
const BaseDAO = require("./baseDAO");

class UserDAO extends BaseDAO {
  async register(data) {
    return Model.register(new Model(data), data.password);
  }

  async findByIdPopulated(id) {
    return Model.findById(id).populate("phone").populate("email");
  }
}

module.exports = new UserDAO(Model);
