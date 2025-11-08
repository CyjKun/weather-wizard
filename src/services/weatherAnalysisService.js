import axios from 'axios';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const MODEL_NAME = process.env.OLLAMA_MODEL || 'mistral'; // Mistral is a good default for structured output

const systemPrompt = `You are a weather analysis expert. You will be given data for a series of route checkpoints. Your task is to format this data into a JSON array, where each object represents the weather at a specific checkpoint.

Your response must always be a valid JSON array, with no additional text before or after.

Each object in the array represents a checkpoint and must follow this exact structure:
{
  "time": "string", // The expected time of arrival at the checkpoint (e.s., "2025-11-09T14:30:00Z")
  "location": "string", // The city or municipality name of the checkpoint
  "weatherData": {
    "precipitation": "string", // The probability of precipitation as a percentage string (e.g., "15%")
    "type": "string" // The weather condition. Must be one of: "Sunny", "Cloudy", "Raining", "Stormy", "Snowy", "Clear"
  }
}

The first object in the array should be the starting location, and the last object should be the final destination.

Example of a valid response:
[
  {
    "time": "2025-11-09T14:00:00Z",
    "location": "Manila City",
    "weatherData": {
      "precipitation": "10%",
      "type": "Cloudy"
    }
  },
  {
    "time": "2025-11-09T14:30:00Z",
    "location": "Pasay City",
    "weatherData": {
      "precipitation": "15%",
      "type": "Cloudy"
    }
  },
  {
    "time": "2025-11-09T15:00:00Z",
    "location": "Bacoor, Cavite",
    "weatherData": {
      "precipitation": "30%",
      "type": "Raining"
    }
  }
]`;

export const analyzeWeatherQuery = async (userQuery) => {
  try {
    const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
      model: MODEL_NAME,
      prompt: `${systemPrompt}\n\nAnalyze the weather for: ${userQuery}\n\nResponse (in JSON format):`,
      stream: false,
      format: 'json' // Some Ollama models support JSON format directly
    });

    // Ollama returns the response in chunks, we need to parse the last response
    let analysis;
    try {
      // First try to parse the response directly
      analysis = JSON.parse(response.data.response);
    } catch (parseError) {
      // If direct parsing fails, try to extract JSON from the text
      const jsonMatch = response.data.response.match(/({[\s\S]*})/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('Failed to parse LLM response as JSON');
      }
    }

    // Validate the response structure
    if (!analysis.location?.city || 
        !analysis.location?.country || 
        !analysis.analysis?.summary || 
        !Array.isArray(analysis.analysis?.recommendations) ||
        !analysis.analysis?.severity ||
        !analysis.timestamp) {
      throw new Error('Invalid response structure from LLM');
    }

    return analysis;
  } catch (error) {
    if (error.response?.status === 503) {
      throw new Error('Ollama server is not available. Please ensure it is running.');
    }
    throw new Error(`Failed to analyze weather: ${error.message}`);
  }
};