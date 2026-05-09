const express = require("express");
const {Resume_upload,extract_text} = require("../Controllers/Resume-Analyzer");
const resume = require("../middleware/multer_middleware");

const router = express.Router();

router.post("/",resume,Resume_upload);

module.exports = router