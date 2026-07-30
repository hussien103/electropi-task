import {WebSocketGateway,WebSocketServer,SubscribeMessage,ConnectedSocket,MessageBody} from "@nestjs/websockets";
import {JwtService} from "@nestjs/jwt";
import {Server,Socket} from "socket.io";
@WebSocketGateway({cors:{origin:process.env.CLIENT_URL||"http://localhost:5173"}})
export class TasksGateway{
 constructor(private jwt:JwtService){}
 @WebSocketServer() server!:Server;
 async handleConnection(client:Socket){try{await this.jwt.verifyAsync(client.handshake.auth.token)}catch{client.disconnect(true)}}
 @SubscribeMessage("project:join") join(@ConnectedSocket()client:Socket,@MessageBody()projectId:string){client.join(`project:${projectId}`)}
 emit(projectId:string,event:string,payload:unknown){this.server.to(`project:${projectId}`).emit(event,payload)}
}
