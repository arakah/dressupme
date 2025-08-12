import express from 'express';
import serverless from 'serverless-http';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from '../routes/authRoutes.js';
import itemRoutes from '../routes/itemRoutes.js';
import outfitRoutes from '../routes/outfitRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/outfits', outfitRoutes);

export default serverless(app);
