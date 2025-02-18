import axios from "axios";
import messageReply from "../utils/MessageUtils.js";

const sendMessage = async (data) => {
    const headers = {
        "Authorization": `Bearer ${process.env.ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      };

    const url = `https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/messages`;

    try {
        const response = await axios.post(url, data, { headers });
        console.log('Status Code:', response.status);
        console.log('Response Data:', response.data);
        return response.data;
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            return { status: 'error', message: 'Request timed out' };
        }
        console.log(`Failed to send message: ${error.message}`);
        return { status: 'error', message: `Failed to send message: ${error.message}` };
    }
};


const generateResponse = (message) => {
    return message.toUpperCase();
};

const getTextMessageInput = (recipient, text) => {
    return JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipient,
        type: 'text',
        text: { preview_url: false, body: text },
    });
};

const processWhatsappMessage = async (body) => {
    const waId = body.entry[0].changes[0].value.contacts[0].wa_id;
    const name = body.entry[0].changes[0].value.contacts[0].profile.name;

    const message = body.entry[0].changes[0].value.messages[0];
    const messageBody = message.text.body;
    logging.info(`Received message body: ${messageBody}`);

    const response = generateResponse(messageBody);

    // OpenAI Integration could go here if needed
    const data = getTextMessageInput(process.env.RECIPIENT_WAID, response);

    await sendMessage(data);
};

const processWhatsappMessage2 = async (body) => {
    try {
        const waId = body.entry[0].changes[0].value.contacts[0].wa_id;
        const name = body.entry[0].changes[0].value.contacts[0].profile.name;

        const messages = body.entry[0].changes[0].value.messages[0];
        let messageBody = '';

        if (messages.type === 'text') {
            messageBody = messages.text.body;
        } else if (messages.type === 'button') {
            messageBody = messages.button.text;
        }

        console.log(`Processed message body: ${messageBody}`);

        const data = messageReply(process.env.RECIPIENT_WAID, messageBody);
        console.log(data);
        await sendMessage(data);
    } catch (error) {
        console.log('Error processing WhatsApp message:', error);
    }
};

const isValidWhatsappMessage = (body) => {
    return body.object && body.entry && body.entry[0].changes && body.entry[0].changes[0].value && body.entry[0].changes[0].value.messages && body.entry[0].changes[0].value.messages[0];
};

export { isValidWhatsappMessage, processWhatsappMessage2, processWhatsappMessage, getTextMessageInput, generateResponse, sendMessage };