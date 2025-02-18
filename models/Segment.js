import mongoose from 'mongoose';

const CriteriaSchema = new mongoose.Schema({
  field: { type: String, required: true },
  operator: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }
});

const SegmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  criteria: { type: [CriteriaSchema], required: true },
  createdAt: { type: Date, default: Date.now }
});

 const Segment = mongoose.models.Segment || mongoose.model("Segment", SegmentSchema);
 export default Segment;