const fs = require("fs");

let GROQ_API_KEY = "";
try {
  const envText = fs.readFileSync(".env.local", "utf8");
  const match = envText.match(/GROQ_API_KEY\s*=\s*(.*)/);
  if (match) {
    GROQ_API_KEY = match[1].trim();
  }
} catch (e) {
  console.error("Could not read .env.local file");
}

if (!GROQ_API_KEY) {
  console.error("GROQ_API_KEY is not defined in .env.local");
  process.exit(1);
}

console.log("Using GROQ API Key:", GROQ_API_KEY.substring(0, 8) + "...");

async function run() {
  try {
    const Groq = require("groq-sdk");
    const groq = new Groq({ apiKey: GROQ_API_KEY });
    console.log("Attempting to generate content with GROQ...");
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: "Write a one-sentence LinkedIn post about AI." }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 500,
    });
    console.log("Success! Response from GROQ:");
    console.log(completion.choices[0]?.message?.content);
  } catch (error) {
    console.error("GROQ failed:", error.message);
  }
}

run();
