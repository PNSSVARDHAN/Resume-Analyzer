const multer = require("multer");

const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,"static/");
    },
    filename : (req,file,cb)=>{
        const file_name = Date.now() + "-" + file.originalname;
        cb(null,file_name);
    }
}); 

const upload = multer({storage});
const resume = upload.single("resume");

module.exports = resume;