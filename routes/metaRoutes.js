import express from 'express';
import {getWhatsAppTemplates} from '../controller/metaController.js';
const router = express.Router();


router.get('/verified-templates', getWhatsAppTemplates);

export default router;