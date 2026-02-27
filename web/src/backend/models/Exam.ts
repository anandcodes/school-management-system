import mongoose, { Schema, Document } from 'mongoose';

export interface IExam extends Document {
  title: string;
  classId: mongoose.Types.ObjectId;
  subject: string;
  date: Date;
  totalMarks: number;
}

const ExamSchema = new Schema<IExam>({
  title: { type: String, required: true },
  classId: { type: Schema.Types.ObjectId, ref: 'SchoolClass', required: true },
  subject: { type: String, required: true },
  date: { type: Date, required: true },
  totalMarks: { type: Number, required: true },
});

export default mongoose.models.Exam || mongoose.model<IExam>('Exam', ExamSchema);
