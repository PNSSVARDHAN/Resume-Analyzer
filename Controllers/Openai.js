    require("dotenv").config();
    const { GoogleGenAI } = require("@google/genai");
    const client = new GoogleGenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

const CHATGPT = async (Input) => {
    try {
        console.log("Openai started");
        const response = await client.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `
            You are an expert ATS resume analyzer and technical recruiter.
            Analyze the following job description and extract the information in a clean structured JSON format.

            Return ONLY valid JSON.

            Extract these fields:

            1. job_role
            2. required_technical_skills
            3. preferred_skills
            4. soft_skills
            5. education_qualification
            6. experience_required
            7. certifications
            8. tools_and_technologies
            9. responsibilities
            10. keywords_for_resume
            11. important_points_for_candidate
            12. job_summary

            Rules:
            - Remove duplicate skills.
            - Extract only meaningful technical skills.
            - Keep skills short and precise.
            - Do not generate fake information.
            - If a field is missing, return an empty array or empty string.
            - keywords_for_resume should contain ATS-friendly keywords.
            - Return arrays wherever applicable.

            Job Description:${Input}`
        });
        console.log("open ai process Done");
        return response.text;
    } catch (err) {
        console.log(err);
    }
};

module.exports = CHATGPT;


