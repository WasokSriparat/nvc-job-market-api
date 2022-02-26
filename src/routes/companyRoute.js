const express = require('express');
const app = express.Router();
const companyController = require('../controllers/companyController')

// Get Data Company
app.get("/", companyController.getCompanies);
app.get("/:id",companyController.getCompanyById);

// app.get("/name/:name",memberController.getProductByName);

app.post("/register", companyController.register);
app.post("/login", companyController.login);

// update Company
app.put("/:id",companyController.updateCompany);


// Address
app.patch("/address/add/:id",companyController.addAddress);
app.patch("/address/update/:id", companyController.updateAddress);

app.delete("/:id", companyController.deleteCompany);

module.exports = app;