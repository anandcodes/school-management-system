import mongoose, { Schema, Document } from 'mongoose';

export interface ISchoolClass extends Document {
  name: string;
  grade: string;
  teacherId?: mongoose.Types.ObjectId;
  time?: string;
  days: string[];
  room?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SchoolClassSchema = new Schema<ISchoolClass>(
  {
    name: { type: String, required: true },
    grade: { type: String, required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher' },
    time: { type: String },
    days: [{ type: String }],
    room: { type: String },
    color: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.SchoolClass || mongoose.model<ISchoolClass>('SchoolClass', SchoolClassSchema);
