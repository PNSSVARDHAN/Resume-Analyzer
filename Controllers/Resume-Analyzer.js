const fs = require("fs");
const pdfModule = require("pdf-parse");
const pdf = pdfModule.default || pdfModule;  
const openai = require("openai");
const skills = require("../Data/skills.json")
const all_skills = Object.values(skills).flat();


const extract_text = async (filename) => {
    const databuffer = fs.readFileSync(filename);
    const data = await pdf(databuffer);
    const skills = Skills_Extraction(data.text.toLowerCase());

};

const Resume_upload = (req,res)=>{
    try{
        extract_text(req.file.path);
        res.send({message : "uploaded Successfully"});
    }catch(err){
        res.send({message : err})
    }
}

const escapeRegex = (text) => {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const Skills_Extraction = (data)=>{
    try{
        const cleaned_text = data.replace(/\n/g," ");
        console.log(cleaned_text);
        const matched_skills = all_skills.filter(skill =>{
            const escapedSkill = escapeRegex(skill);
            const regex = new RegExp(`\\b${escapedSkill}\\b`, "i");
            return regex.test(cleaned_text);
        })
        return matched_skills;
    }catch(err){
        console.log({message : err});
    }

}

module.exports = {Resume_upload,extract_text};