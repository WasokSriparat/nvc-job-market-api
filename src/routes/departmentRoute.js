const express = require('express');
const app = express.Router();
const departmentController = require('../controllers/departmentController')
const auth = require("../middleware/auth");

app.get("/", departmentController.getDepartments);
app.get("/:id", departmentController.getDepartmentById);

app.post("/",auth, departmentController.addDepartment);

app.put("/:id",auth, departmentController.updateDepartment);

app.delete("/:id",auth, departmentController.deleteDepartment);

module.exports = app;