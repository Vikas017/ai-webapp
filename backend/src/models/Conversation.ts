import mongoose, { Document, Schema } from 'mongoose';

export interface IConversation extends Document {
  prompt: string;
  response: string;
  createdAt: Date;
}

const ConversationSchema: Schema = new Schema({
  prompt: { type: String, required: true },
  response: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IConversation>('Conversation', ConversationSchema);