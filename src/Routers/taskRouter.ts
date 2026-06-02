import { Router } from "express";
import { createTask ,getAllTasks,updateTask,deleteTask} from "../Controllers/taskController";
import { protect } from "../MiddleWare/protectMiddleware";
import { validate } from "../MiddleWare/validateMiddleware";
import { createTaskSchema } from "../Controllers/Validations/task.validation";
import { removeMemberFromWorkspace , addMemberToWorkspace, updateMemberRole, leaveWorkspace, getMemberProfile} from "../Controllers/workspaceControllers/workspaceMemberControllers";
import { checkPermission } from "../MiddleWare/workspaceAuth";
const TaskRouter = Router();

/**
 * @route   POST /api/v1/tasks
 * @desc    Create a new task
 * @access  Private
 */
TaskRouter.post(
  "/createtask", 
  protect,                  
  validate(createTaskSchema), 
  createTask                 
);
TaskRouter.get("/", protect, getAllTasks);
TaskRouter.route("/update/:id").patch(protect, updateTask);
TaskRouter.route("/delete/:id").delete(protect, deleteTask);

TaskRouter.delete(
  "/remove-member", 
  protect, 
  checkPermission("MANAGE_MEMBERS"), 
  removeMemberFromWorkspace
);

TaskRouter.post(
  "/add-member", 
  protect, 
  checkPermission("MANAGE_MEMBERS"), 
  addMemberToWorkspace
);

TaskRouter.patch(
  "/update-role", 
  protect, 
  checkPermission("MANAGE_MEMBERS"), 
  updateMemberRole
);
TaskRouter.delete("/leave-workspace", protect, leaveWorkspace);
TaskRouter.get("/member-profile/:userId", protect, getMemberProfile);
export default TaskRouter;