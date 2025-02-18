import mongoose from 'mongoose';

const automationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  segments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Segment' }],
  message: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  trigger: { type: mongoose.Schema.Types.ObjectId, ref: 'Trigger' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
});

const Automation = mongoose.model('Automation', automationSchema);
export default Automation;