const express = require('express');
const app = express.Router();
const positionController = require('../controllers/positionController')
const auth = require("../middleware/auth");

app.get("/", positionController.getPositions);
app.get("/:id", positionController.getPositionById);

app.post("/",auth, positionController.addPosition);

app.put("/:id",auth, positionController.updatePosition);

app.delete("/:id",auth, positionController.deletePosition);

module.exports = app;