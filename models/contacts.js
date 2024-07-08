// const fs = require("fs/promises");
// const { v4: uuidv4 } = require("uuid");


// const listContacts = async () => {
//   try {
//     const data = await fs.readFile("./models/contacts.json");
//     return JSON.parse(data.toString());
//   } catch (err) {
//     console.error(err.message);
//     throw err;
//   }
// };

// const getContactById = async (contactId) => {
//   try {
//     const data = await fs.readFile("./models/contacts.json");
//     const contacts = JSON.parse(data.toString());
//     const contact = contacts.find((contact) => contact.id === contactId);
//     return contact;
//   } catch (err) {
//     console.error(err.message);
//     throw err;
//   }
// };

// const removeContact = async (contactId) => {
//   try {
//     const data = await fs.readFile("./models/contacts.json", "utf-8");
//     const contacts = JSON.parse(data);
//     const updatedList = contacts.filter((contact) => contact.id !== contactId);

//     if (contacts.length === updatedList.length) {
//       return null;
//     }
//     await fs.writeFile(
//       "./models/contacts.json",
//       JSON.stringify(updatedList, null, 2),
//       "utf-8"
//     );
//     return updatedList;
//   } catch (err) {
//     console.error(err.message);
//     throw err;
//   }
// };

// const addContact = async (body) => {
//   const { name, email, phone } = body;
//   const data = await fs.readFile("./models/contacts.json", "utf-8");
//   const contacts = JSON.parse(data);

//   const newContact = {
//     id: uuidv4(),
//     name: name,
//     email: email,
//     phone: phone,
//   };
//   contacts.push(newContact);

//   await fs.writeFile(
//     "./models/contacts.json",
//     JSON.stringify(contacts, null, 2),
//     "utf-8"
//   );
//   return newContact;
// };

// const updateContact = async (contactId, body) => {
//   const { name, email, phone } = body;
//   try {
//     const data = await fs.readFile("./models/contacts.json", "utf-8");
//     const contacts = JSON.parse(data);
//     const contact = contacts.find((contact) => contact.id === contactId);

//     contact.name = name;
//     contact.email = email;
//     contact.phone = phone;

//     await fs.writeFile(
//       "./models/contacts.json",
//       JSON.stringify(contacts, null, 2),
//       "utf-8"
//     );
//     await fs.readFile("./models/contacts.json");
//     return data;
//   } catch (err) {
//     console.error(err.message);
//     throw err;
//   }
// };


// module.exports = {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact,
//   updateContact,
// };
