const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: 'gemini-3.1-flash-lite',
    systemInstruction: "You are a JSON generator. Follow this format: {\"questions\":[{\"title\":\"\",\"question\":\"\",\"example_1\":\"\",\"example_2\":\"\"}]}"
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};

export const gameQuestions = model.startChat({
    generationConfig,
    history: [
        {
            role: "user",
            parts: [
                { text: "Generate a set of 4 coding interview questions covering HASHMAPS with a difficulty level of EASY. Provide examples of expected output. The question should be thorough and detailed and resemble the style of leetcode questions. The question titles should describe the problem that is being generated. Output the response in JSON format. The text will be placed in an HTML div, so do not format output at all. No asterisks or code blocks. Follow the given structure:\n{\nquestions: [\n{\ntitle: String,\nquestion: String,\nexample_1: String,\nexample_2: String,\n}\n]\n}" },
            ],
        },
        {
            role: "model",
            parts: [
                { text: "{\"questions\":[{\"title\":\"string\",\"question\":\"string\",\"example_1\":\"string\",\"example_2\":\"string\"}]}" },
            ],
        },
        {
            role: "user",
            parts: [
                { text: "Generate a set of 6 coding interview questions covering ARRAYS with a difficulty level of MEDIUM. Provide examples of expected output. The question should be thorough and detailed and resemble the style of leetcode questions. The question titles should describe the problem that is being generated. Output the response in JSON format. The text will be placed in an HTML div, so do not format output at all. No asterisks or code blocks. Follow the given structure:\n{\nquestions: [\n{\ntitle: String,\nquestion: String,\nexample_1: String,\nexample_2: String,\n}\n]\n}" },
            ],
        },
        {
            role: "model",
            parts: [
                { text: "{\"questions\":[{\"title\":\"string\",\"question\":\"string\",\"example_1\":\"string\",\"example_2\":\"string\"}]}" },
            ],
        },
    ],
});
