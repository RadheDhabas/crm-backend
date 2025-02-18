import Campaign from "../models/Campaign.js";


async function sendMessageToUser(campaignId, user, message_template) {
    try {
        const headers = {
            "Authorization": `Bearer ${process.env.ACCESS_TOKEN}`,
            "Content-Type": "application/json"
        };
        // I can fetch templates from meta using template name
        const url = `https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/messages`;

        const body = {
            messaging_product: "whatsapp",
            to: user.phone,
            type: "template",
            template: {
                name: message_template,
                language: { code: "en_US" }
            }
        };

        // Send message to user via WhatsApp API
        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body)
        });

        const data = await response.json();
        console.log("Response after sending message: ", data, ", response end.");

        if (data && data.messages && data.messages[0].message_status === 'accepted') {
            await updateCampaignStats(campaignId, 'sent');
            await updateMessageStatus(campaignId, user._id, 'sent');
        } else {
            await updateMessageStatus(campaignId, user._id, 'failed');
        }
    } catch (error) {
        console.error("Error sending message:", error);
        await updateMessageStatus(campaignId, user._id, 'failed');
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
async function updateMessageStatus(campaignId, userId, status) {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return;

    const messageStatus = {
        user: userId,
        status: status, // sent, delivered, viewed, failed
        timestamp: new Date()
    };

    campaign.message_status.push(messageStatus);
    await campaign.save();
}

const handelWebhookEvent = async (recipientPhone, messageStatus) => {
    try {
        const campaign = await Campaign.findOne({ "message_status.user": recipientPhone });
        if (campaign) {
            updateCampaignStats(campaign._id,messageStatus);
        }
    } catch (error) {
        console.log("Error while updating stats in webhook event.")
    }
}

export { sendMessageToUser, updateCampaignStats, updateMessageStatus, handelWebhookEvent };