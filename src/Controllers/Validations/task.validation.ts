import {z} from "zod"
import { TaskStatus, TaskPriority } from "../../Types/Task.Type";
export const createTaskSchema = z.object({
  body: z.object({
   title: z.string().min(1, "Title is required").min(3, "Title must be at least 3 characters"),
    
    description: z
      .string()
      .max(500, "Description cannot exceed 500 characters")
      .optional(),
    
    status: z.nativeEnum(TaskStatus).optional(),
    
    priority: z.nativeEnum(TaskPriority).optional(),
    
    dueDate: z.string().datetime().optional().or(z.date().optional()),
  }),
});



export const GroupSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().max(500).optional(),
  workspaceId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Workspace ID"),
  assigneeId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Assignee ID"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueDate: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
});