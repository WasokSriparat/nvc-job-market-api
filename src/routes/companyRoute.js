const express = require('express');
const app = express.Router();
const companyController = require('../controllers/companyController')
const auth = require("../middleware/auth");

// Get Data Company
app.get("/", companyController.getCompanies);
app.get("/:id",companyController.getCompanyById);

// app.get("/name/:name",memberController.getProductByName);

app.post("/register", companyController.register);
app.post("/login", companyController.login);

// update Company
app.put("/:id",auth,companyController.updateCompany);


// Address
app.patch("/address/add/:id",auth,companyController.addAddress);
app.patch("/address/update/:id",auth, companyController.updateAddress);

app.delete("/:id",auth, companyController.deleteCompany);

module.exports = app;