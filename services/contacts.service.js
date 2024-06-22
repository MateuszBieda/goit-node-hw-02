const Contact = require("../models/contacts.model");

const getAll = async (query) => {
  return Contact.find(query);
};

const getOne = async (id, userId) => {
  return Contact.findOne({ _id: id, owner: userId });
};
const create = async (data) => {
  return Contact.create(data);
};
const update = async (id, userId, data) => {
  return Contact.findOneAndUpdate({ _id: id, owner: userId }, data);
};
const updateStatus = async (id,userId, favorite) => {
  return Contact.findByIdAndUpdate({_id:id,owner:userId}, { favorite });
};
const remove = async (id,userId) => {
  return Contact.findOneAndDelete({_id:id, owner: userId});
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  updateStatus,
  remove,
};
