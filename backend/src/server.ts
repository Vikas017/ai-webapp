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
app.get('/ping', (req, res) => {
  res.json({ status: 'alive', timestamp: new Date().toISOString() });
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-webapp')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Keep-alive function to prevent server sleep
const keepAlive = () => {
  setInterval(async () => {
    try {
      const response = await fetch(`http://localhost:${PORT}/ping`);
      console.log('Keep-alive ping:', await response.json());
    } catch (error) {
      console.log('Keep-alive ping failed:', error);
    }
  }, 14 * 60 * 1000); // 14 minutes
};

app.listen(PORT, (): void => {
  console.log(`Server running on port ${PORT}`);
  keepAlive();
});