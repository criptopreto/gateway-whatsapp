"use strict";
const Model = require("../models/phone");
const BaseDAO = require("./baseDAO");

class PhoneDAO extends BaseDAO {
  async findByNumber(phone) {
    return Model.findOne({ phone }).populate("_user");
  }
}

module.exports = new PhoneDAO(Model);
