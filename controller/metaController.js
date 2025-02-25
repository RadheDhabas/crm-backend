import axios from "axios";

export const getWhatsAppTemplates = async (req, res) => {
    const headers = {
        "Authorization": `Bearer ${process.env.ACCESS_TOKEN}`,
        "Content-Type": "application/json"
    };

    const url = `https://graph.facebook.com/${process.env.VERSION}/${process.env.WHATSAPP_B_A_ID}/message_templates`;
    try {
        const response = await axios.get(url, { headers });
        const data = response.data.data;
        const templates = data.map((item, index) => (
            {
                id: item.id,
                template_name: item.name,
                language: item.language,
                status: item.status,
                content: item.components.map((i) => ({ "type": i.type, "text": i.text })),
            }
        ));
        return res.status(200).json(templates);
    } catch (error) {
        console.error('Error fetching templates:', error.response ? error.response.data : error.message);
    }
}
export const getWhatsAppTemplateById = async (req, res) => {
    const id = req.params.id;
    try {
        const headers = {
            "Authorization": `Bearer ${process.env.ACCESS_TOKEN}`,
            "Content-Type": "application/json"
        };

        const url = `https://graph.facebook.com/${process.env.VERSION}/${id}`;
        const response = await axios.get(url, { headers });

        return res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching template:", error.response?.data || error.message);
    }
}