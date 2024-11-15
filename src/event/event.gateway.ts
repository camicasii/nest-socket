import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';


// import { from, Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
// import { Server, WebSocket } from 'ws';

@WebSocketGateway(
  // 3000,
  {
    path: '/ws',
    
    // namespace: 'event',
    transports: ['websocket'],

     
    cors: {
      origin: '*',
    },
  }
)
export class EventGateway  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor(private readonly eventService: EventService) {}

  afterInit(server: Server) {
    console.log(server);
    
    console.log('Server Initialized Successfully');
  }
 
  handleConnection(client: Socket, ...args: any[]) {
    console.log('Client Connected');
    
    // client.emit(JSON.stringify({ event: 'connection', data: 'Connected to server '  }));
    client.emit('connection', {data:'Connected to server'});
    
  }
  handleDisconnect(client: any) {
    console.log('Client Disconnected');
  }

  @SubscribeMessage('ping')
  ping(@MessageBody() createEventDto: any,  @ConnectedSocket() client: Socket) {

    console.log(createEventDto);
    
    // return this.eventService.create(createEventDto);
  // client.send("pong");
    // return "pong";
    const response = JSON.stringify({ event: 'pong', data: 'pong' });
    // client.send(response);
    client.emit('pong', {data:'pong'});
    return response;
  }



  @SubscribeMessage('createEvent')
  create(@MessageBody() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @SubscribeMessage('findAllEvent')
  findAll() {
    return this.eventService.findAll();
  }

  @SubscribeMessage('findOneEvent')
  findOne(@MessageBody() id: number) {
    return this.eventService.findOne(id);
  }

  @SubscribeMessage('updateEvent')
  update(@MessageBody() updateEventDto: UpdateEventDto) {
    return this.eventService.update(updateEventDto.id, updateEventDto);
  }

  @SubscribeMessage('removeEvent')
  remove(@MessageBody() id: number) {
    return this.eventService.remove(id);
  }
}
