import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import apiRoutes from './routes/api';

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3001', 10);

app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

// Keep-alive endpoint
app.get('/ping', (_req, res) => {
  res.json({ status: 'alive', timestamp: new Date().toISOString() });
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-webapp')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Keep-alive function to prevent server sleep
const keepAlive = () => {
  const serverUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
  setInterval(async () => {
    try {
      const response = await fetch(`${serverUrl}/ping`);
      console.log('Keep-alive ping:', await response.json());
    } catch (error) {
      console.log('Keep-alive ping failed:', error);
    }
  }, 14 * 60 * 1000); // 14 minutes
};

app.listen(PORT, '0.0.0.0', (): void => {
  console.log(`Server running on port ${PORT}`);
  // Start keep-alive after 5 minutes to let server fully initialize
  setTimeout(() => {
    keepAlive();
  }, 5 * 60 * 1000);
});