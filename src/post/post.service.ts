import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

const notFoundExceptionMessage = 'No post with given ID exists.'

@Injectable()
export class PostService {
 constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

 async create(createPostDto: CreatePostDto, userID: string): Promise<Post>{
  const createdPost = new this.postModel({...createPostDto, authorId: userID});
  return createdPost.save();
 }

 async update(postId: string, data: UpdatePostDto): Promise<Post> {
  const updatedPost = await this.postModel.findByIdAndUpdate(postId, data, {new: true}).exec();

  if(!updatedPost){
   throw new NotFoundException(notFoundExceptionMessage);
  }

  return updatedPost;
 }

 async delete(postId: string): Promise<Post> {
  const deletedPost = await this.postModel.findByIdAndDelete(postId).exec();

  if(!deletedPost) {
   throw new NotFoundException(notFoundExceptionMessage);
  }

  return deletedPost;
 }

 async find(postId:string): Promise<Post> {
  const foundPost = await this.postModel.findById(postId);

  if(!foundPost){
   throw new NotFoundException(notFoundExceptionMessage);
  }
  
  return foundPost;
 }

 async findAll(authorId?: string, title?: string): Promise<Post[]> {
  const filter = [];

  if(authorId) {
   filter['authorId'] = authorId;
  }

  if(title) {
   filter['title'] = { $regex: title, $options: 'i'};
  }

  return this.postModel.find(filter).exec();
 }
}
