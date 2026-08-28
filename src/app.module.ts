import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [ConfigModule.forRoot({isGlobal: true, expandVariables: true}), MongooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => ({
      uri: config.get<string>('MONGO_URI'),
    })
  }), UserModule, PostModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
