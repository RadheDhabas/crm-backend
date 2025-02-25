import axios from "axios";
import Campaign from "../models/Campaign.js";


async function sendMessageToUser(campaign, user) {
    try {

        const headers = {
            "Authorization": `Bearer ${process.env.ACCESS_TOKEN}`,
            "Content-Type": "application/json"
        };
        // I can fetch templates from meta using template id
        const template = await fetchWhatsAppTemplate(campaign.meta_template);

        const url = `https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/messages`;
        const body = {
            messaging_product: "whatsapp",
            to: user.phoneId,
            type: "template",
            template: {
                name: template.name,
                language: { code: template.language }
            }
        };

        // Send message to user via WhatsApp API
        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body)
        });

        const data = await response.json();
        if (data && data.messages && data.messages[0].message_status === 'accepted') {
            await updateMessageStatus(campaign.id, user.phoneId, 'sent', data.messages[0].id);
        } else {
            await updateMessageStatus(campaign.id, user.phoneId, 'failed', "");
            await updateCampaignStats(campaign.id, "failed");
        }
    } catch (error) {
        console.error("Error sending message:", error);
        await updateMessageStatus(campaign.id, user.phoneId, 'failed', "");
        await updateCampaignStats(campaign.id, "failed");
    }
}

// Update stats for campaign (sent, delivered, viewed, failed)
async function updateCampaignStats(campaignId, status) {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return;

    // Update stats based on message status
    if (status === 'sent') {
        campaign.stats.sent += 1;
    } else if (status === 'delivered') {
        campaign.stats.delivered += 1;
    } else if (status === 'read') {
        campaign.stats.viewed += 1;
    } else if (status === 'failed') {
        campaign.stats.failed += 1;
    }

    // Save updated stats
    await campaign.save();
}

// Update message status for each user in the campaign
async function updateMessageStatus(campaignId, phoneId, status, message_id) {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return;

    const messageStatus = {
        message_id: message_id,
        userPhoneId: phoneId,
        status: status, // sent, failed
        timestamp: new Date()
    };

    campaign.message_status.push(messageStatus);
    await campaign.save();
}

const handelWebhookEvent = async (userPhoneId, messageStatus, message_id) => {
    userPhoneId = "+" + userPhoneId;
    try {
        const campaign = await Campaign.findOne({
            message_status: {
                $elemMatch: { userPhoneId: userPhoneId, message_id: message_id }
            }
        });
        if (campaign) {
            await updateCampaignStats(campaign._id, messageStatus);
        }
    } catch (error) {
        console.log("Error while updating stats in webhook event.")
    }
}
const fetchWhatsAppTemplate = async () => {

    try {
        const headers = {
            "Authorization": `Bearer ${process.env.ACCESS_TOKEN}`,
            "Content-Type": "application/json"
        };

        const url = `https://graph.facebook.com/${process.env.VERSION}/725061719810861`;
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error) {
        console.error("Error fetching template:", error.response?.data || error.message);
    }
}

export { sendMessageToUser, updateCampaignStats, updateMessageStatus, handelWebhookEvent };