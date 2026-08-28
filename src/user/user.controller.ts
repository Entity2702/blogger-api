import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { AuthGuard } from '../auth/auth.guard';
@Controller('user')
export class UserController {
 constructor(private readonly userService: UserService) {}

 @Post()
 create(@Body() createUserDto: CreateUserDto) {
  return this.userService.create(createUserDto);
 }

 @UseGuards(AuthGuard)
 @Delete()
 delete(@Body() id: string) {
  return this.userService.delete(id);
 }

}
