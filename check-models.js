const { GoogleGenerativeAI } = require("@google/generative-ai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY not found in environment variables");
  process.exit(1);
}

async function checkModels() {
  try {
    console.log("Checking available Gemini models...");
    
    // Make a direct API call to list models
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.models) {
      console.log("Available models:");
      data.models.forEach(model => {
        console.log(`- ${model.name}: ${model.displayName || 'No display name'}`);
        console.log(`  Supported methods: ${model.supportedGenerationMethods?.join(', ') || 'None'}`);
        console.log('');
      });
    } else {
      console.log("Response:", JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("Error checking models:", error.message);
  }
}

checkModels();