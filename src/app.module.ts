import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';
import { EventGateway } from './event/event.gateway';

@Module({
  imports: [EventModule],
  controllers: [AppController],
  providers: [AppService,EventGateway],
  
})
export class AppModule {}
