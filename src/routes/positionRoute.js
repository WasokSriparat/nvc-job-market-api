const express = require('express');
const app = express.Router();
const positionController = require('../controllers/positionController')

app.get("/", positionController.getPositions);
app.get("/:id", positionController.getPositionById);

app.post("/", positionController.addPosition);

app.put("/:id", positionController.updatePosition);

app.delete("/:id", positionController.deletePosition);

module.exports = app;