const contactsService = require("../services/contacts.service");
const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required().email({ minDomainSegments: 2 }),
  phone: Joi.string()
    .required()
    .pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
});

const querySchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email({ minDomainSegments: 2 }),
  phone: Joi.string().pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
  favorite: Joi.boolean().optional(),
});

const get = async (req, res, next) => {
  const { error } = querySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const { query, user } = req;
    const results = await contactsService.getContacts({
      ...query,
      owner: user._id,
    });
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
    const results = await contactsService.getContact(id, user._id);
    res.json({ status: "success", code: 200, data: { contact: results } });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const create = async (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const { body, user } = req;
    const results = await contactsService.createContact({
      ...body,
      owner: user._id,
    });
    res.json({ status: "success", code: 200, data: { contact: results } });
  } catch (e) {
    console.error(e);
    next(e);
  }
};
const update = async (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const { id } = req.params;
    const { body, user } = req;
    const results = await contactsService.updateContact(id, user._id, body);
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
    const results = await contactsService.removeContact(id, user._id);
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
