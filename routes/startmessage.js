import express from "express"; 
import axios from "axios";
const router = express.Router();

router.get('/send-first-message', async(req,res)=>{
    const url = `https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/messages`;
  
    const headers = {
      "Authorization": `Bearer ${process.env.ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    };
  
    const data = {
      "messaging_product": "whatsapp",
      "to": process.env.RECIPIENT_WAID,
      "type": "template",
      "template": {
        "name": "hello_world",
        "language": { "code": "en_US" }
      }
    };
    try {
      const response = await axios.post(url, data, { headers });
      
      console.log('Status Code:', response.status);
      console.log('Response Data:', response.data);
      res.status(200).json({"status":"ok"})
    } catch (error) {
      console.error('Error sending message:', error.response ? error.response.data : error.message);
    }
});

export default router;