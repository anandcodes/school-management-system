import mongoose, { Schema, Document } from 'mongoose';

export interface IFeeRecord extends Document {
  studentId: mongoose.Types.ObjectId;
  type: string;
  amount: number;
  dueDate: Date;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
}

const FeeRecordSchema = new Schema<IFeeRecord>({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['PAID', 'PENDING', 'OVERDUE'], required: true },
});

export default mongoose.models.FeeRecord || mongoose.model<IFeeRecord>('FeeRecord', FeeRecordSchema);
