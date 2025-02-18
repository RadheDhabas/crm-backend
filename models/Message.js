import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  type: { type: String, enum: ['text', 'image', 'template'], required: true },
  content: { type: String, required: true },
});

const Message = mongoose.model('Message', messageSchema);
export default Message;