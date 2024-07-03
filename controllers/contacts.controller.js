const contactsService = require("../services/contacts.service");
const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required().email({ minDomainSegments: 2 }),
  phone: Joi.string()
    .required()
    .pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
});

const get = async (req, res, next) => {
  try {
    const results = await contactsService.getContacts();
    res.json({ status: "success", code: 200, data: { contacts: results } });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const getById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await contactsService.getContact(id);
    if (result) {
      res.json({ status: "success", code: 200, data: { contact: result } });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${id}`,
        data: "Not Found",
      });
    }
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
    const { body } = req;
    const results = await contactsService.createContact(body);
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

  const { id } = req.params;
  const { body } = req;
  try {
    const result = await contactsService.updateContact(id, body);
    if (result) {
      res.json({ status: "success", code: 200, data: { contact: result } });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${id}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const updateFavorite = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  if (typeof favorite === "undefined") {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "missing field favorite",
    });
  }
  try {
    const result = await contactsService.updateStatus(contactId, { favorite });

    if (!result) {
      res.status(400).json({
        status: "error",
        code: 400,
        message: "missing field favorite",
        data: "Not Found",
      });
    } else {
      res.json({ status: "success", code: 200, data: { contact: result } });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const results = await contactsService.removeContact(id);
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
