import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceService } from './price.service';
import { MailService } from './mail.service';
import { Price } from './price.entity';

@Module({
  imports: [
    // Configure ConfigModule to load environment variables
    ConfigModule.forRoot({
      isGlobal: true, // This makes the ConfigModule available globally without needing to import it in other modules
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: +process.env.MYSQL_PORT,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      autoLoadEntities: true,
      synchronize: true,  // Disable this in production to avoid accidental schema changes
    }),
    TypeOrmModule.forFeature([Price]), // Ensure entities are loaded
  ],
  providers: [PriceService, MailService], // Register services
})
export class AppModule {}
