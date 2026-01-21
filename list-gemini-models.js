require('dotenv').config({ path: '.env.local' });

const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listAvailableModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set in .env.local');
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Get the models list endpoint directly
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (data.models && Array.isArray(data.models)) {
      console.log('Available Gemini models:');
      data.models.forEach(model => {
        if (model.name.includes('gemini')) {
          console.log(`- ${model.name.replace('models/', '')} (${model.displayName})`);
          console.log(`  Description: ${model.description}`);
          console.log(`  Version: ${model.version}`);
          console.log(`  Input Token Limit: ${model.inputTokenLimit}`);
          console.log(`  Output Token Limit: ${model.outputTokenLimit}`);
          console.log('');
        }
      });
    } else {
      console.error('Failed to fetch models:', data);
    }
  } catch (error) {
    console.error('Error listing models:', error);
  }
}

listAvailableModels();