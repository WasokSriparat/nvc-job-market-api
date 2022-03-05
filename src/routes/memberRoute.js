const express = require('express');
const app = express.Router();
const memberController = require('../controllers/memberController')
const auth = require("../middleware/auth");

// Get Data Member
app.get("/", memberController.getMembers);
app.get("/:id",memberController.getMemberById);

// app.get("/name/:name",memberController.getProductByName);

app.post("/register", memberController.register);
app.post("/login", memberController.login);

// update member
app.put("/:id",auth,memberController.updateMember);

//update pic
app.patch("/profile/update/:id",auth,memberController.updatePic);

// Address
app.patch("/address/update/:id",auth,memberController.updateAddress);

// Education
app.patch("/education/add/:id",auth,memberController.addEducation);
app.patch("/education/delete/:id",auth,memberController.deleteEducation);

app.delete("/:id",auth, memberController.deleteMember);

module.exports = app;