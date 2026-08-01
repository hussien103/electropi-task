import {WebSocketGateway,WebSocketServer,SubscribeMessage,ConnectedSocket,MessageBody,OnGatewayInit} from "@nestjs/websockets";
import {JwtService} from "@nestjs/jwt";
import {Server,Socket} from "socket.io";
import {corsOrigin} from "../cors.js";
@WebSocketGateway({cors:{origin:corsOrigin}})
export class TasksGateway implements OnGatewayInit{
 constructor(private jwt:JwtService){}
 @WebSocketServer() server!:Server;
 afterInit(server:Server){this.server=server}
 async handleConnection(client:Socket){try{await this.jwt.verifyAsync(client.handshake.auth.token)}catch{client.disconnect(true)}}
 @SubscribeMessage("project:join") join(@ConnectedSocket()client:Socket,@MessageBody()projectId:string){client.join(`project:${projectId}`)}
 emit(projectId:string,event:string,payload:unknown){this.server?.to(`project:${projectId}`).emit(event,payload)}
}
