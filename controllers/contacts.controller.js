const contactsService = require("../services/contacts.service");

const get = async (req, res, next) => {
  try {
    const { query, user } = req;
    const results = await contactsService.getAll({ ...query, owner: user._id });
    res.json({ status: "success", code: 200, data: { contacts: results } });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const getById = async (req, res, next) => {
  try {
    const { params, user } = req;
    const { id } = params;
    const results = await contactsService.getOne(id, user._id);
    res.json({ status: "success", code: 200, data: { contact: results } });
  } catch (e) {
    console.error(e);
    next(e);
  }
};
const create = async (req, res, next) => {
  try {
    const { body, user } = req;
    const results = await contactsService.create({ ...body, owner: user._id });
    res.json({ status: "success", code: 200, data: { contact: results } });
  } catch (e) {
    console.error(e);
    next(e);
  }
};
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body, user } = req;
    const results = await contactsService.update(id, user._id, body);
    res.json({ status: "success", code: 200, data: { contact: results } });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const updateFavorite = async (req, res, next) => {
  try {
    const { body, params, user } = req;
    const { id } = params;
    const { favorite } = body;
    const results = await contactsService.updateStatus(id, user._id, favorite);
    res.json({ status: "success", code: 200, data: { contact: results } });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const results = await contactsService.remove(id, user._id);
    res.json({
      status: "success",
      code: 200,
      data: { id, data: { contact: results } },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

module.exports = {
  get,
  getById,
  create,
  update,
  updateFavorite,
  remove,
};
