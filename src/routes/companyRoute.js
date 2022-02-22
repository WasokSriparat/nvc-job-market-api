const express = require('express');
const app = express.Router();
const companyController = require('../controllers/companyController')

// Get Data Company
app.get("/", companyController.getCompanies);
app.get("/:id",companyController.getCompanyById);

// app.get("/name/:name",memberController.getProductByName);

app.post("/register", companyController.register);
app.post("/login", companyController.login);

// phone number
app.patch("/phone/add/:id",companyController.addPhoneNumber);
app.patch("/phone/update/:id", companyController.updatePhoneNumber);

// Description
app.patch("/description/add/:id",companyController.addDescription);
app.patch("/description/update/:id",companyController.updateDescription);

// Address
app.patch("/address/add/:id",companyController.addAddress);
app.patch("/address/update/:id", companyController.updateAddress);

app.delete("/:id", companyController.deleteCompany);

module.exports = app;