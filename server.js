import express from 'express';
import dotenv from "dotenv";
import startmessage from './routes/startmessage.js';
import webhook from './routes/webhook.js';
import metaRoutes from './routes/metaRoutes.js';
import campaignRouter from './routes/campaignRoutes.js';

import cors from "cors";
import connectDB from './config/db.js';
dotenv.config();

const app = express();
app.use(cors());

app.use(express.json()); 
connectDB();
const PORT =  8200;
app.get('/', (req, res) => {
  res.send('OK');
});

app.use('/webhook',webhook);
app.use('/', startmessage);
// Working Routes
app.use('/api/meta',metaRoutes);
app.use('/api/campaigns',campaignRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});