
import { isValidWhatsappMessage } from '../services/WhatsAppService.js';
import { handelWebhookEvent } from '../services/sendMessage.js';

async function handelMessages(req,res){
    const body = req.body;
    // Check if it's a WhatsApp status update
    if (
      body.entry?.[0]?.changes?.[0]?.value?.statuses
    ) {
      const statusUpdate = body.entry?.[0]?.changes?.[0]?.value?.statuses[0];
      const status = body.entry?.[0]?.changes?.[0]?.value?.statuses[0]?.status;
      const recipientPhone = statusUpdate.recipient_id;
      const messageStatus = statusUpdate.status;

      console.log('Received a WhatsApp status update in webhook route ---->',status);
      await handelWebhookEvent(recipientPhone,messageStatus);
      return res.status(200).json({ status: 'ok' });
    }
  
    try {
      if (isValidWhatsappMessage(body)) {
        return res.status(200).json({ status: 'ok' });
      } else {
        // if the request is not a WhatsApp API event, return an error
        return res.status(404).json({ status: 'error', message: 'Not a WhatsApp API event' });
      }
    } catch (err) {
      console.error('Failed to decode JSON', err);
      return res.status(400).json({ status: 'error', message: 'Invalid JSON provided' });
    }
}



export default handelMessages;