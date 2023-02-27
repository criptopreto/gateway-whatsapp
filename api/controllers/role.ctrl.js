"use strict";
const Role = require("../services/role.service");
const { HTTP_OK } = require("../helpers/constants/httpStatusCodes");

const controllers = {
  create: async (req, res, next) => {
    try {
      const role = await Role.create(req.body);
      return res.status(HTTP_OK).send({ status: 1, message: "success", role });
    } catch (error) {
      next(error);
    }
  },
  get_all: async (req, res, next) => {
    try {
      const roles = await Role.findAll();
      return res.json(roles);
    } catch (error) {
      next(error);
    }
  },
  set_default: async (req, res, next) => {
    try {
      await Role.setDefault(req.params.id);
      return res.json({
        success: true,
        message: `Role ${req.params.id} set as default`,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = controllers;
