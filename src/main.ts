import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  // Initialize the Nest application
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Crypto Monitoring')
    .setDescription('API documentation')
    .setVersion('1.0')
    .build();

  // Create the Swagger document
  const document = SwaggerModule.createDocument(app, config);

  // Setup the Swagger UI at the /api endpoint
  SwaggerModule.setup('api', app, document);

  // Start the application and listen on port 3000
  await app.listen(3000);
}

bootstrap();
