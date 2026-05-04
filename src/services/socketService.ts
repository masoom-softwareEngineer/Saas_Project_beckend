import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";

/**
 * @description:  Socket Manager with Authentication and Room Logic
 */
export const setupSocketHandlers = (io: Server) => {
  
  io.use((socket: Socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.cookie;

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      
      (socket as any).user = decoded;
      
      next(); 
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

 
  io.on("connection", (socket: Socket) => {
    const userId = (socket as any).user?._id;
    console.log(`⚡ Verified User Connected: ${userId} (Socket ID: ${socket.id})`);

   
    socket.on("join_workspace", (workspaceId: string) => {
      socket.join(workspaceId);
      console.log(`👥 User ${userId} joined room: ${workspaceId}`);
    });

    socket.on("leave_workspace", (workspaceId: string) => {
      socket.leave(workspaceId);
      console.log(`🏃 User ${userId} left room: ${workspaceId}`);
    });

   
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${userId}`);
    });
  });
};

/**
 * @description: Global Helper to send messages to a specific workspace
 */
export const emitToWorkspace = (io: Server, workspaceId: string, eventName: string, data: any) => {
  io.to(workspaceId).emit(eventName, data);
};