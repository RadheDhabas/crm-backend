import express from 'express';
import {getWhatsAppTemplateById, getWhatsAppTemplates} from '../controller/metaController.js';
const router = express.Router();


router.get('/verified-templates', getWhatsAppTemplates);
router.get('/get-templet/:id',getWhatsAppTemplateById);
export default router;