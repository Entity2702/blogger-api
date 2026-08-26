import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
 imports: [UserModule,
  JwtModule.registerAsync({
   global: true,
   inject: [ConfigService],
   useFactory: async (configService: ConfigService) =>({
    secret: configService.get<string>('JWT_SECRET'),
   }),
   
  })
 ],
 providers: [AuthService],
 controllers: [AuthController],
 exports: [AuthService]
})
export class AuthModule {}
