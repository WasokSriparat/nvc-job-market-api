const express = require('express');
const app = express.Router();
const memberController = require('../controllers/memberController')

// app.get("/", memberController);

// app.get("/:id",memberController);

// app.get("/name/:name",memberController.getProductByName);

app.post("/register", memberController.register);
app.post("/login", memberController.login);

// app.put("/:id", memberController.editWholeProduct);

// app.patch("/:id",memberController.editProduct);

// app.delete("/:id", memberController.deleteProduct);

module.exports = app;