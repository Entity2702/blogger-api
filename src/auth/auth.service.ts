import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './signin.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
 constructor(
  private readonly userService: UserService,
  private readonly jwtService: JwtService
 ) {}

 async signIn(signInDto: SignInDto): Promise<any>{
  const user = await this.userService.findByEmail(signInDto.email);

  if(!user){
   throw new ConflictException('No user with this email exists. Try creating a new user.');
  }

  if(!await bcrypt.compare(signInDto.password,user.password)){
   throw new UnauthorizedException('Wrong password!');
  }

  const payload = {sub: user.id, email: user.email};

  return {
   access_token: await this.jwtService.signAsync(payload),
  };
 }
}
