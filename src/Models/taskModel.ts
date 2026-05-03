import mongoose, { Schema, Document, Types } from "mongoose";

// Enums for strict values
export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  DONE = "done",
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export interface ITask extends Document {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
 
  createdBy: Types.ObjectId; 
  assignee: Types.ObjectId;  
  workspace?: Types.ObjectId; 
}

const TaskSchema = new Schema<ITask>(
  {
    title: { 
      type: String, 
      required: [true, "Task title is required"], 
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"]
    },
    description: { 
      type: String, 
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"]
    },
    status: { 
      type: String, 
      enum: ["todo", "in_progress", "completed", "done"],
      default: TaskStatus.TODO 
    },
    priority: { 
      type: String, 
      enum: Object.values(TaskPriority), 
      default: TaskPriority.MEDIUM 
    },
    dueDate: { 
      type: Date 
    },
 
    createdBy: { 
      type: Schema.Types.ObjectId, 
      ref: "SaasUser",
      required: [true, "Creator ID is required"] 
    },
 
    assignee: { 
      type: Schema.Types.ObjectId, 
      ref: "SaasUser", 
      required: [true, "Assignee is required"] 
    },
   
    workspace: { 
      type: Schema.Types.ObjectId, 
      ref: "Workspace", 
      required: false 
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


TaskSchema.index({ createdBy: 1, workspace: 1, status: 1 });

export const Task = mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);