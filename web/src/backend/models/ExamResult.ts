import mongoose, { Schema, Document } from 'mongoose';

export interface IExamResult extends Document {
  examId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  marksObtained: number;
  grade: string;
  remarks?: string;
}

const ExamResultSchema = new Schema<IExamResult>({
  examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  marksObtained: { type: Number, required: true },
  grade: { type: String, required: true },
  remarks: { type: String },
});

export default mongoose.models.ExamResult || mongoose.model<IExamResult>('ExamResult', ExamResultSchema);
