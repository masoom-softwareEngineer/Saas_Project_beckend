import { Request, Response, NextFunction } from "express";
import { Workspace, WorkspaceRole } from "../../Models/workSpace";
import { asyncHandler } from "../../MiddleWare/asyncHandler"; 
import { AppError } from "../../utils/AppError"; 

/**
 * @desc    Create a new workspace (Optimized & Secure)
 * @route   POST /api/v1/workspace/create-workspaces
 * @access  Private (Logged-in users)
 */
export const createWorkspace = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name, description } = req.body;
  const userId = (req as any).user._id;

  if (!name) {
    return next(new AppError("Please provide a workspace name", 400));
  }

  const newWorkspace = await Workspace.create({
    name,
    description,
    owner: userId,
    members: [
      {
        user: userId,
        role: WorkspaceRole.ADMIN, 
        joinedAt: new Date(),
      },
    ],
  });

  res.status(201).json({
    success: true,
    message: "Workspace created successfully",
    data: newWorkspace,
  });
});


/**
 * @desc    Get all workspaces where the current user is a member or owner
 * @route   GET /api/v1/workspace/workspaces
 * @access  Private
 */
export const getAllMyWorkspaces = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user._id;
  const workspaces = await Workspace.find({
    "members.user": userId
  })
  .sort("-createdAt")
  .lean(); 

  res.status(200).json({
    success: true,
    count: workspaces.length,
    data: workspaces,
  });
});


export const getWorkspaceById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const workspace = req.workspace;
  if (!workspace) {
    return next(new AppError("Workspace not found", 404));
  }

  const workspaceData = typeof workspace.toObject === "function" ? workspace.toObject() : workspace;

  res.status(200).json({
    success: true,
    data: workspaceData, 
    stats: { 
      activeTasks: 12, 
      totalMembers: workspaceData.members ? workspaceData.members.length : 0
    }
  });
});