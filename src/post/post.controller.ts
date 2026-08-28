import { Body, Controller, Patch, Post, Request, Param, Delete, Get, Query } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('post')
export class PostController {
 constructor(private readonly postService: PostService) {}

 @UseGuards(AuthGuard)
 @Post()
 create(@Body() createPostDto: CreatePostDto, @Request() req) {
  const userID = req.user.sub;

  return this.postService.create(createPostDto, userID);
 }

 @UseGuards(AuthGuard)
 @Patch(':id')
 update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
  return this.postService.update(id, updatePostDto);
 }

 @UseGuards(AuthGuard)
 @Delete(':id')
 delete(@Param('id') id: string) {
  return this.postService.delete(id);
 }

 @Get()
 getAll(@Query('authorId') authorId?: string, @Query('title') title?: string) {
  return this.postService.findAll(authorId, title);
 }

 @Get(':id')
 getById(@Param('id') id: string) {
  return this.postService.find(id);
 }
}
