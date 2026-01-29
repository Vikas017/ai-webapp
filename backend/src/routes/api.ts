import express, { Request, Response } from 'express';
import axios from 'axios';
import Conversation from '../models/Conversation';

const router = express.Router();

interface AskAIRequest {
  prompt: string;
}

router.post('/ask-ai', async (req: Request<{}, {}, AskAIRequest>, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      res.status(400).json({ success: false, error: 'Prompt is required' });
      return;
    }

    if (!process.env.OPENROUTER_API_KEY) {
      res.status(500).json({ success: false, error: 'OpenRouter API key not configured' });
      return;
    }

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'google/gemini-2.5-flash-lite-preview-09-2025',
      messages: [{ role: 'user', content: prompt }]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const aiResponse = response.data.choices[0].message.content;
    res.json({ success: true, response: aiResponse });
  } catch (error: any) {
    console.error('OpenRouter API Error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get AI response',
      details: error.response?.data || error.message
    });
  }
});

router.post('/save', async (req: Request<{}, {}, { prompt: string; response: string }>, res: Response) => {
  try {
    const { prompt, response } = req.body;
    const conversation = new Conversation({ prompt, response });
    await conversation.save();
    res.json({ success: true, message: 'Conversation saved' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to save conversation' });
  }
});

router.get('/history', async (_req: Request, res: Response) => {
  try {
    const conversations = await Conversation.find()
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch history' });
  }
});

export default router;