import { Router } from "express";
import { protect } from "../MiddleWare/protectMiddleware";
import { createGroupTask, getGroupAllTasks , deleteGroupTask, updateGroupTask} from "../Controllers/workspaceControllers/workspaceTaskController";
import { createWorkspace, getAllMyWorkspaces, getWorkspaceById } from "../Controllers/workspaceControllers/workspaceController";
import { checkPermission } from "../MiddleWare/workspaceAuth";

const WorkspaceRouter = Router({ mergeParams: true });

WorkspaceRouter.post("/create-workspaces", protect, createWorkspace);
WorkspaceRouter.get("/workspaces", protect, getAllMyWorkspaces);

WorkspaceRouter.get(
  "/single/:workspaceId", 
  protect, 
  checkPermission("VIEW_WORKSPACE"), 
  getWorkspaceById
);

WorkspaceRouter.post(
  "/:workspaceId/create-task", 
  protect, 
  checkPermission("CREATE_TASK"), 
  createGroupTask
);

WorkspaceRouter.get(
  "/get-group-task/:workspaceId", 
  protect,
  checkPermission("VIEW_WORKSPACE"),
  getGroupAllTasks
);

WorkspaceRouter.delete(
  "/:workspaceId/tasks/:taskId", 
  protect, 
  checkPermission("DELETE_TASK"),
  deleteGroupTask
);

WorkspaceRouter.patch(
  "/:workspaceId/tasks/:taskId", 
  protect, 
  checkPermission("UPDATE_TASK_STATUS"), 
  updateGroupTask
);

export default WorkspaceRouter;