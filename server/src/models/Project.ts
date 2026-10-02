import mongoose, { Schema, Document, Model } from 'mongoose';

export type ProjectStatus = 'active' | 'archived';

export interface IProject extends Document {
  name: string;
  description?: string;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema<IProject> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [1, 'Project name cannot be empty'],
      maxlength: [100, 'Project name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'archived'],
        message: 'Status must be either active or archived',
      },
      default: 'active',
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: true, // Rejects unmodeled properties
  }
);

// Indexes
ProjectSchema.index({ createdAt: -1 });
ProjectSchema.index({ name: 1 });

export const Project: Model<IProject> = mongoose.model<IProject>('Project', ProjectSchema);
