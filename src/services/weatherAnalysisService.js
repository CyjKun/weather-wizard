import axios from 'axios';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const MODEL_NAME = process.env.OLLAMA_MODEL || 'mistral'; // Mistral is a good default for structured output

const systemPrompt = `You are a weather analysis expert. Given a location and time, provide a structured weather analysis.
Your response must always follow this exact JSON structure, with no additional text before or after:
{
  "location": {
    "city": string,
    "country": string
  },
  "analysis": {
    "summary": string (2-3 sentences),
    "recommendations": string[] (3 items),
    "severity": "low" | "moderate" | "high"
  },
  "timestamp": string (ISO format)
}`;

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