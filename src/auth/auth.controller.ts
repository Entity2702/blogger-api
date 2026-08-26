import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './signin.dto';
import { AuthGuard } from './auth.guard';
@Controller('auth')
export class AuthController {
 constructor(private readonly authService: AuthService) {}

 @HttpCode(HttpStatus.OK)
 @Post('login')
 signIn(@Body() signInDto: SignInDto) {
  return this.authService.signIn(signInDto);
 }

 @UseGuards(AuthGuard)
 @Get('user')
 getUser(@Request() req) {
  return req.user;
 }
}
