import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
 constructor(@InjectModel(User.name) private userModel: Model<User>) {}

 async create(createUserDto: CreateUserDto): Promise<User> {
  const existingUser = await this.userModel.findOne({email: createUserDto.email});

  if(existingUser){
   throw new ConflictException('User with this email already exists.');
  }

  const rounds = 10;
  const hashedPassword = await bcrypt.hash(createUserDto.password, rounds);

  const createdUser = new this.userModel({...createUserDto, password: hashedPassword});
  return createdUser.save();
 }

 async findByEmail(email: string) {
  return this.userModel.findOne({email});
 }

 
}
