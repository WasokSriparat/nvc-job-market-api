const express = require('express');
const app = express.Router();
const departmentController = require('../controllers/departmentController')

app.get("/", departmentController.getDepartments);
app.get("/:id", departmentController.getDepartmentById);

app.post("/", departmentController.addDepartment);

app.put("/:id", departmentController.updateDepartment);

app.delete("/:id", departmentController.deleteDepartment);

module.exports = app;