const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

let GEMINI_API_KEY = "";
try {
  const envText = fs.readFileSync(".env.local", "utf8");
  const match = envText.match(/GEMINI_API_KEY\s*=\s*(.*)/);
  if (match) {
    GEMINI_API_KEY = match[1].trim();
  }
} catch (e) {
  console.error("Could not read .env.local file");
}

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not defined in .env.local");
  process.exit(1);
}

console.log("Using API Key:", GEMINI_API_KEY.substring(0, 8) + "...");

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function run() {
  try {
    console.log("Attempting to generate content with gemini-2.5-pro...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const result = await model.generateContent("Write a one-sentence LinkedIn post about AI.");
    console.log("Success! Response from gemini-2.5-pro:");
    console.log(result.response.text());
  } catch (error) {
    console.error("gemini-2.5-pro failed:", error.message);
    
    try {
      console.log("Attempting fallback to gemini-2.5-flash...");
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent("Write a one-sentence LinkedIn post about AI.");
      console.log("Success! Response from gemini-2.5-flash:");
      console.log(result.response.text());
    } catch (fallbackError) {
      console.error("gemini-2.5-flash failed:", fallbackError.message);
    }
  }
}

run();
