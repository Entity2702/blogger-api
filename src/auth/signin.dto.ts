import { IsEmail, IsEmpty, MinLength } from "class-validator";

export class SignInDto{
 @IsEmpty()
 @IsEmail()
 email!: string

 @IsEmpty()
 @MinLength(8)
 password!: string
}