import type { Server } from "socket.io";
let io: Server | undefined;
export const setIO = (server: Server) => { io = server; };
export const emitProject = (projectId: string, event: string, payload: unknown) => io?.to(`project:${projectId}`).emit(event, payload);
