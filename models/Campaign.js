import mongoose from 'mongoose';

const CampaignSchema = new mongoose.Schema({
    campaign_name: { type: String, required: true, unique: true },
    segment: { type: mongoose.Schema.Types.ObjectId, ref: 'Segment', required: true },
    runTime: { type: Date, required: true },
    meta_template: {
        template_name: { type: String, required: true },
        language: { type: String, required: true }
    },
    status: {
        type: String,
        enum: ['scheduled', 'running', 'completed', 'stoped'],
        default: 'scheduled'
    },
    stats: {
        sent: { type: Number, default: 0 },
        delivered: { type: Number, default: 0 },
        viewed: { type: Number, default: 0 }
    },
    message_status: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['sent', 'delivered', 'viewed', 'failed'], required: true },
        timestamp: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

CampaignSchema.index({ campaign_name: 1, run_date: 1 });

const Campaign = mongoose.models.Campaign || mongoose.model('Campaign', CampaignSchema);
export default Campaign;