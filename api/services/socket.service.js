"use strict";
const Model = require("../models/socket");

const BaseDAO = require("./baseDAO");
const userService = require("./user.service");

class SocketDAO extends BaseDAO {
  async findBySessionID(session_id) {
    return await Model.findOne({ session_id });
  }

  async findByUserId(user) {
    return await Model.findOne({ user });
  }

  async upsert(data) {
    let user = await userService.findById(data.user);
    if (!user) return null;
    let session = await Model.findOneAndUpdate(
      { user: data.user },
      { $set: data },
      { new: true }
    );
    if (session) return session;
    if (!session) return await Model.create(data);
  }
}

module.exports = new SocketDAO(Model);
