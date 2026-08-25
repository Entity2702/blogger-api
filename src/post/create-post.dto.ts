import { IsEmpty } from "class-validator";

export class CreatePostDto {
 @IsEmpty()
 title!: string;

 @IsEmpty()
 content!: string;
}