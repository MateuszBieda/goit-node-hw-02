const Contact = require("../models/contacts.model");


const getContacts = async () => {
  return Contact.find();
};

const getContact = async (id) => {
  return Contact.findById(id);

};
const createContact = async (data) => {
  return Contact.create(data);
};

const updateContact = async (id, toUpdate) => {
  return Contact.findByIdAndUpdate(
    id,
    { $set: toUpdate },
    { new: true, upsert: false, includeResultMetadata: false }
  );
};
const updateStatus = async (id, toUpdate) => {
  return Contact.findByIdAndUpdate(
    id,
    { $set: toUpdate },
    { new: true, upsert: false, includeResultMetadata: false }
  );
};
const removeContact = async (id) => {
  return Contact.findByIdAndDelete(id);

};

module.exports = {
  getContacts,
  getContact,
  createContact,
  updateContact,
  updateStatus,
  removeContact,
};
