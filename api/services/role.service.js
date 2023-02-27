"use strict";
const Model = require("../models/role");
const BaseDAO = require("./baseDAO");

class RoleDAO extends BaseDAO {
  async findByName(name) {
    return Model.findOne({ name });
  }

  async setDefault(_id) {
    await Model.updateMany({ default: true }, { default: false });
    await Model.updateOne({ _id }, { default: true });
    return true;
  }
}

module.exports = new RoleDAO(Model);
