const express = require('express');
const app = express.Router();
const companyController = require('../controllers/companyController')

// app.get("/", memberController);

// app.get("/:id",memberController);

// app.get("/name/:name",memberController.getProductByName);

app.post("/register", companyController.register);
app.post("/login", companyController.login);

// app.put("/:id", memberController.editWholeProduct);

// app.patch("/:id",memberController.editProduct);

// app.delete("/:id", memberController.deleteProduct);

module.exports = app;