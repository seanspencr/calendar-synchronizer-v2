import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  // somehow tanpa ini dia gmau karena preflightnya ketolak somehting cors
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Private-Network', 'true');
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:8081');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');

    // Short-circuit OPTIONS preflight immediately
    if (req.method === 'OPTIONS') {
      return res.status(204).send();
    }

    next();
  });

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8081', // Expo default web port
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: '*',
    
  });

  const config = new DocumentBuilder()
      .setVersion('1.0')
      .addCookieAuth('authorization', {
        type: 'apiKey',
        in: 'cookie',
        description: 'JWT Authorization cookie',
      })
      .build();


  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.use(cookieParser());


  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
