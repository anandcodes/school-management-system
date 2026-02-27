import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  name: string;
  email: string;
  grade: string;
  status: 'ACTIVE' | 'ABSENT' | 'SUSPENDED';
  avatar?: string;
  classId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    grade: { type: String, required: true },
    status: { type: String, enum: ['ACTIVE', 'ABSENT', 'SUSPENDED'], default: 'ACTIVE' },
    avatar: { type: String },
    classId: { type: Schema.Types.ObjectId, ref: 'SchoolClass' },
  },
  { timestamps: true }
);

export default mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
