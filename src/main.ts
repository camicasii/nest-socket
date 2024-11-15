import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { IoAdapter } from '@nestjs/platform-socket.io';;
import { WsAdapter } from '@nestjs/platform-ws';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);  
  // const newa= new IoAdapter(app);
  // app.useWebSocketAdapter(newa);
  app.enableCors({
    origin: '*',
    // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // allowedHeaders: 'Content-Type, Accept',
  }); // Enable CORS
   app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
