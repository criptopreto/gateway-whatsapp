"use strict";
const Model = require("../models/email");
const BaseDAO = require("./baseDAO");

class EmailDAO extends BaseDAO {
  async findByEmail(email) {
    return Model.findOne({ email }).populate("_user");
  }
}

module.exports = new EmailDAO(Model);
