import cron from "node-cron";
import Campaign from '../models/Campaign.js';
import { fetchSegmentedUsers } from "../services/segmentedUserHelper.js";
import { sendMessageToUser } from "../services/sendMessage.js";

let scheduledJobs = {};
export const scheduleCampaign = async (req, res) => {
  const { campaign_id, campaign_name } = req.body;
  try {
    const campaigns = await Campaign.find({ status: "scheduled" });
    Object.values(scheduledJobs).forEach((job) => job.stop());
    scheduledJobs = {};
    campaigns.forEach((campaign) => {
      const runDateTime = new Date(campaign.runTime);
      const cronTime = `${runDateTime.getUTCMinutes()} ${runDateTime.getUTCHours()} ${runDateTime.getUTCDate()} ${runDateTime.getUTCMonth() + 1} *`;

      const job = cron.schedule(cronTime, async () => {
        await processCampaign(campaign._id);
      }, {
        timezone: "UTC"
      });
      scheduledJobs[campaign._id] = job;
      console.log(`📅 Campaign "${campaign.campaign_name}" scheduled for ${runDateTime}`);
    });
    return res.send({
      campaign_name: campaign_name,
      message: "Scheduled Successfully!"
    });
  } catch (error) {
    console.log("Error in schedule campaigns: ", error);
  }
}

// Process Campaign
async function processCampaign(campaignId) {
  try {
    const campaign = await Campaign.findById(campaignId);
    campaign.status = "running";
    await campaign.save();

    const users = await fetchSegmentedUsers(campaign.segment);
    console.log("Messages sending process started...");
    for (let user of users) {
      await sendMessageToUser(campaignId, user, campaign.meta_template);
    }

    campaign.status = "completed";
    await campaign.save();
  } catch (error) {
    console.log("Error while processing campaign: ", error);
    throw (error);
  }
}