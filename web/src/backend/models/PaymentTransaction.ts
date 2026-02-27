import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentTransaction extends Document {
  feeId: mongoose.Types.ObjectId;
  amountPaid: number;
  date: Date;
  method: string;
}

const PaymentTransactionSchema = new Schema<IPaymentTransaction>({
  feeId: { type: Schema.Types.ObjectId, ref: 'FeeRecord', required: true },
  amountPaid: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  method: { type: String, required: true },
});

export default mongoose.models.PaymentTransaction || mongoose.model<IPaymentTransaction>('PaymentTransaction', PaymentTransactionSchema);
