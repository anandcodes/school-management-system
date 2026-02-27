import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacher extends Document {
  name: string;
  email: string;
  subject: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeacherSchema = new Schema<ITeacher>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    avatar: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Teacher || mongoose.model<ITeacher>('Teacher', TeacherSchema);
