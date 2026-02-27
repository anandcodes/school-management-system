import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendanceRecord extends Document {
  studentId: mongoose.Types.ObjectId;
  date: Date;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  remarks?: string;
}

const AttendanceRecordSchema = new Schema<IAttendanceRecord>({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'], required: true },
  remarks: { type: String },
});

export default mongoose.models.AttendanceRecord || mongoose.model<IAttendanceRecord>('AttendanceRecord', AttendanceRecordSchema);
