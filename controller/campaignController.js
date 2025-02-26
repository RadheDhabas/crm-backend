import cron from "node-cron";
import Campaign from '../models/Campaign.js';
import { fetchSegmentedUsers } from "../services/segmentedUserHelper.js";
import { sendMessageToUser } from "../services/sendMessage.js";

let scheduledJobs = {};
export const scheduleCampaign = async (req, res) => {
  const { campaign_id } = req.body;
  try {
    const campaign = await Campaign.findById(campaign_id);
    const runDateTime = new Date(campaign.runTime);
    const cronTime = `${runDateTime.getUTCMinutes()} ${runDateTime.getUTCHours()} ${runDateTime.getUTCDate()} ${runDateTime.getUTCMonth() + 1} *`;

    const job = cron.schedule(cronTime, async () => {
      await processCampaign(campaign);
    }, {
      timezone: "UTC"
    });
    console.log(`📅 Campaign "${campaign.campaign_name}" scheduled for ${runDateTime}`);
    return res.send({
      success: true
    });
  } catch (error) {
    console.log("Error in schedule campaigns: ", error);
  }
}

// Process Campaign
async function processCampaign(campaign) {
  try {
    campaign.status = "running";
    await campaign.save();

    const users = await fetchSegmentedUsers(campaign.segment);
    console.log("Messages sending process started...");
    
    for (let user of users) {
      await sendMessageToUser(campaign, user);
    }
    campaign.status = "completed";
    await campaign.save();
  } catch (error) {
    console.log("Error while processing campaign: ", error);
    throw (error);
  }
}