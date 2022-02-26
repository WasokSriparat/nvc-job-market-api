require('dotenv').config({ path: './config.env'});
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 4002;

const memberRoute = require("./routes/memberRoute");
const companyRoute = require("./routes/companyRoute");
const jobPostRoute = require("./routes/jobPostRoute.js");
const positionRoute = require("./routes/positionRoute");
const departmentRoute = require("./routes/departmentRoute");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

require("./db")(app);

app.use("/member",memberRoute);
app.use("/company",companyRoute);
app.use("/jobpost",jobPostRoute);
app.use("/position",positionRoute);
app.use("/department",departmentRoute);

app.get("/",(req, res)=>{
    res.send("Hello from index");
});

app.listen(port, ()=>{
    console.log(`App is running on port ${port}`);
});