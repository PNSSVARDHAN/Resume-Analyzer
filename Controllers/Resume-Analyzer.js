const fs = require("fs");
const pdfModule = require("pdf-parse");
const pdf = pdfModule.default || pdfModule;
const openai = require("openai");
const skills = require("../Data/skills.json")
const jd_skills = require("../Controllers/Openai");
const all_skills = Object.values(skills).flat();
require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const { compose } = require("stream");
const client = new GoogleGenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// swithc for the entire workflow is here

const extract_text = async (filename, job_description) => {
    try {
        console.log("Text Extarction Started");
        const databuffer = fs.readFileSync(filename);
        const data = await pdf(databuffer);
        // console.log("Got Data from Pdf");
        const resume_skills = await Skills_Extraction(data.text.toLowerCase());
        let job_description_from_gemini = await jd_skills(job_description);
        job_description_from_gemini =
            job_description_from_gemini
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();
        // console.log("Received Job Description from gemini");
        job_description_from_gemini = JSON.parse(job_description_from_gemini);
        const require_skills = job_description_from_gemini.required_technical_skills
            .map(skill => {
                return skill.toLowerCase();
            });   
        // console.log(require_skills);
        // console.log("converteed the string to json");
        // console.log(resume_skills)
        const ats = calculateATS(require_skills, resume_skills)
        // console.log(ats);
        return ats
    } catch (err) {
        return err
    }
};

const Resume_upload = async (req, res) => {
    try {
        const response = await extract_text(req.file.path, req.body.job_description);
        res.send(response);
    } catch (err) {
        res.send({ message: err })
    }
}

const escapeRegex = (text) => {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const Skills_Extraction = (data) => {
    console.log("Extracting Skills from resume");
    try {
        const cleaned_text = data.replace(/\n/g, " ");
        // console.log(cleaned_text);
        const matched_skills = all_skills.filter(skill => {
            const escapedSkill = escapeRegex(skill);
            const regex = new RegExp(`\\b${escapedSkill}\\b`, "i");
            return regex.test(cleaned_text);
        })
        // console.log("Extracting Skills from resume is Done");
        return matched_skills;
    } catch (err) {
        console.log({ message: err });
    }

}

const calculateATS = (requiredSkills, resumeSkills) => {

    const matchedSkills = requiredSkills.filter(skill =>
        resumeSkills.includes(skill)
    );

    const missingSkills = requiredSkills.filter(skill =>
        !resumeSkills.includes(skill)
    );

    const atsScore = Math.round(
        (matchedSkills.length / requiredSkills.length) * 100
    );

    return {
        atsScore,
        matchedSkills,
        missingSkills
    };

};

module.exports = { Resume_upload, extract_text };