import express from 'express';
import { scheduleCampaign } from '../controller/campaignController.js';

const router = express.Router();

router.post('/schedule-campaign', scheduleCampaign);

export default router;