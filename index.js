require("dotenv").config();
const Resume = require("./Routes/ResumeAnalyzer");
const DefaultRouter = require("./Routes/DefaultRoute");
const express = require("express");
const app = express();
app.use(express.json());

app.use("/files",express.static("static"));
app.use("/api",DefaultRouter);
app.use("/",Resume);

app.listen(process.env.PORT ,()=>{
    console.log(`Server is running in ${process.env.PORT}`);
})

