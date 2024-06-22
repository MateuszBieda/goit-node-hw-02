const express = require("express");
const contacts = require("./../././../models/contacts");
const router = express.Router();
const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required().email({ minDomainSegments: 2 }),
  phone: Joi.string()
    .required()
    .pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
});

const validation = schema.validate({
  name: "John Newman",
  email: "johnnewman@gmail.com",
  phone: "(129) 123-3657",
});
if (validation.error) {
  console.log(validation.error.details);
}
router.get("/", async (req, res, next) => {
  try {
    const data = await contacts.listContacts();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const contact = await contacts.getContactById(contactId);
    if (contact) {
      res.json(contact);
    } else {
      console.log("No contact found, sending 404");
      res.status(404).json({ message: "Not found" });
    }
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { name, email, phone } = req.body;
  try {
    if (!name || !email || !phone) {
      return res.status(400).json({ message: "missing required name - field" });
    } else {
      const newContactItem = await contacts.addContact({
        name: name,
        email: email,
        phone: phone,
      });
      res
        .status(201)
        .json({ message: "Contact added successfully", newContactItem });
    }
  } catch (err) {
    next(err);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const contactId = req.params.contactId;
  try {
    const updatedContacts = await contacts.removeContact(contactId);

    if (updatedContacts) {
      res.status(200).json({ message: "contact deleted", updatedContacts });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (err) {
    next(err);
  }
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "missing fields" });
  }
  try {
    const updatedContactItem = await contacts.updateContact(contactId, {
      name,
      email,
      phone,
    });

    if (updatedContactItem) {
      res.json({ status: "success", code: 200, data: { updatedContactItem } });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
