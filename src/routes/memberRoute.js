const express = require('express');
const app = express.Router();
const memberController = require('../controllers/memberController')

app.get("/", memberController.getMembers);

app.get("/:id",memberController.getMemberById);

// app.get("/name/:name",memberController.getProductByName);

app.post("/register", memberController.register);
app.post("/login", memberController.login);

// phone_number
app.patch("/phone/add/:id",memberController.addPhoneNumber);
app.patch("/phone/update/:id", memberController.updatePhoneNumber);

// Address
app.patch("/address/add/:id",memberController.addAddress);
app.patch("/address/update/:id", memberController.updateAddress);

// Education
app.patch("/education/add/:id",memberController.addEducation);
app.patch("/education/update/:id", memberController.updateEducation);
app.patch("/education/delete/:id",memberController.deleteEducation);

app.delete("/:id", memberController.deleteMember);

module.exports = app;