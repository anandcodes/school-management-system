import mongoose, { Schema, Document } from 'mongoose';

export interface IScheduleEvent extends Document {
  title: string;
  day: string;
  startTime: string;
  endTime?: string;
  teacherId?: mongoose.Types.ObjectId;
  room?: string;
  color?: string;
}

const ScheduleEventSchema = new Schema<IScheduleEvent>({
  title: { type: String, required: true },
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String },
  teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher' },
  room: { type: String },
  color: { type: String },
});

export default mongoose.models.ScheduleEvent || mongoose.model<IScheduleEvent>('ScheduleEvent', ScheduleEventSchema);
