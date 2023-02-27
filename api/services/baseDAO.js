'use strict';
class BaseDAO {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return await this.model.create(data);
  }

  async findAll() {
    return this.model.find();
  }
  async findById(id) {
    return this.model.findById(id);
  }
  async findOne(filter) {
    return this.model.findOne(filter);
  }

  async update(id, values) {
    return this.model.update({ id }, values);
  }

  async deleteById(id) {
    return this.model.findByIdAndRemove(id);
  }

  async delete(filter) {
    return this.model.deleteOne(filter);
  }

  async findOrCreate(criteria) {
    return this.model.findOneAndUpdate(criteria, criteria, {
      returnDocument: 'after',
      upsert: true,
    });
  }
}

module.exports = BaseDAO;
