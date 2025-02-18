import mongoose from 'mongoose';

const triggerSchema = new mongoose.Schema({
  type: { type: String, enum: ['keyword', 'time'], required: true },
  keyword: { type: String },
  time: { type: Date },
});

const Trigger = mongoose.model('Trigger', triggerSchema);
export default Trigger;