import { Router } from "express";
import { protect } from "../MiddleWare/protectMiddleware";
import { createGroupTask, getGroupAllTasks } from "../Controllers/workspaceControllers/workspaceTaskController";
import { createWorkspace,getAllMyWorkspaces, getWorkspaceById } from "../Controllers/workspaceControllers/workspaceController";
const WorkspaceRouter = Router();



WorkspaceRouter.post("/create-workspaces", protect, createWorkspace);
WorkspaceRouter.get("/workspaces", protect, getAllMyWorkspaces);
WorkspaceRouter.get("/workspaces/:id", protect, getWorkspaceById);
WorkspaceRouter.post("/create-task", protect, createGroupTask);
WorkspaceRouter.get("/get-group-task/:workspaceId", protect,getGroupAllTasks);
export default WorkspaceRouter;