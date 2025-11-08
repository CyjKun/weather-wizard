import axios from 'axios';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const MODEL_NAME = process.env.OLLAMA_MODEL || 'mistral'; // Mistral is a good default for structured output

const systemPrompt = `You are a weather analysis expert. You will be given data for a series of route checkpoints. Your task is to format this data into a JSON array, where each object represents the weather at a specific checkpoint.

Your response must always be a valid JSON array, with no additional text before or after.

Each object in the array represents a checkpoint and must follow this exact structure:
{
  "location": "string", // The city or municipality name of the checkpoint
  "weatherData": [
    {
      "time": "string", // The time of the forecast (e.g., "08:00 AM")
      "precipitation": "string", // The probability of precipitation (e.g., "15%")
      "type": "string" // Must be one of: "Sunny", "Cloudy", "Raining", "Stormy", "Snowy", "Clear"
    }
  ]
}

The array should contain the start location and the final destination. The "weatherData" array should contain forecasts in 3-hour intervals for the next 12 hours.

Example of a valid response:
[
  {
    "location": "San Francisco",
    "weatherData": [
      {
        "time": "08:00 AM",
        "precipitation": "5%",
        "type": "Sunny"
      },
      {
        "time": "11:00 AM",
        "precipitation": "20%",
        "type": "Cloudy"
      },
      {
        "time": "02:00 PM",
        "precipitation": "80%",
        "type": "Raining"
      }
    ]
  },
  {
    "location": "Seattle",
    "weatherData": [
      {
        "time": "08:00 AM",
        "precipitation": "85%",
        "type": "Raining"
      },
      {
        "time": "11:00 AM",
        "precipitation": "60%",
        "type": "Cloudy"
      },
      {
        "time": "02:00 PM",
        "precipitation": "30%",
        "type": "Cloudy"
      }
    ]
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
    // if (!analysis.location?.city || 
    //     !analysis.location?.country || 
    //     !analysis.analysis?.summary || 
    //     !Array.isArray(analysis.analysis?.recommendations) ||
    //     !analysis.analysis?.severity ||
    //     !analysis.timestamp) {
    //   throw new Error('Invalid response structure from LLM');
    // }

    return analysis;
  } catch (error) {
    if (error.response?.status === 503) {
      throw new Error('Ollama server is not available. Please ensure it is running.');
    }
    throw new Error(`Failed to analyze weather: ${error.message}`);
  }
};