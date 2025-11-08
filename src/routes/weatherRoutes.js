import express from 'express';
import { analyzeWeatherQuery } from '../services/weatherAnalysisService.js';

const router = express.Router();

router.post('/analyze', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({
        error: 'Query is required'
      });
    }

    const analysis = await analyzeWeatherQuery(query);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

export default router;