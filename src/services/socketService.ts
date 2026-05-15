import * as cookie from "cookie"; 
import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
/**
 * @description:  Socket Manager with Authentication and Room Logic
 */
export const setupSocketHandlers = (io: Server) => {
  

  io.use((socket: Socket, next) => {
    try {
      const rawCookies = socket.handshake.headers.cookie;

      if (!rawCookies) {
        console.log( "No cookies found in handshake");
        return next(new Error("Authentication error: No cookies found"));
      }
      const parsedCookies = cookie.parse(rawCookies);
      const token = parsedCookies.SaasAccessToken;

      if (!token) {
        console.log(" SaasAccessToken not found in cookies");
        return next(new Error("Authentication error: Token not found"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      (socket as any).user = decoded;
      
      next();
    } catch (err) {
      console.error("❌ Socket Auth Error:", err);
      next(new Error("Authentication error: Invalid token"));
    }
  });
 
  io.on("connection", (socket: Socket) => {
    const userId = (socket as any).user?.id;
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