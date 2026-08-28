import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';

class MockPostService {
  constructor(public data: any) {}

  save = jest.fn().mockImplementation(() => Promise.resolve(this.data));

  static findByIdAndUpdate = jest.fn().mockReturnValue({
    exec: jest.fn()
  });
  static findByIdAndDelete = jest.fn().mockReturnValue({
    exec: jest.fn()
  });
  static findById = jest.fn().mockReturnValue({
    exec: jest.fn()
  });

  static find = jest.fn();
  
}

describe('PostService', () => {
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService, 
        {
          provide: getModelToken('Post'), 
          useValue: MockPostService,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    jest.clearAllMocks();
  });

  it('should create new post', async () => {
    const dto = {title: 'title', content: 'content'};
    const authorId = 'userId';

    const result = await service.create(dto, authorId);

    expect(result.authorId).toEqual(authorId);
    expect(result.title).toEqual(dto.title);
    expect(result.content).toEqual(dto.content);
  });

  it('should update post', async () => {
    const data = {title: "new title", content: 'new content'};
    const postId = 'postId';

    MockPostService.findByIdAndUpdate.mockReturnValue({
      exec: jest.fn().mockResolvedValue({_id: postId, title: data.title, content: data.content })
    });

    const result = await service.update(postId, data);

    expect(result._id).toEqual(postId);
    expect(result.title).toEqual(data.title);
    expect(result.content).toEqual(data.content);
    expect(MockPostService.findByIdAndUpdate).toHaveBeenLastCalledWith(postId, data, {new: true});
  });

  it('should throw not found exception', async () => {
    const data = {title: "new title", content: 'new content'};
    const postId = 'postId';

    MockPostService.findByIdAndUpdate.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null)
    });

    await expect(service.update(postId, data)).rejects.toThrow(NotFoundException);
    expect(MockPostService.findByIdAndUpdate).toHaveBeenLastCalledWith(postId, data, {new: true});
  });

  it('should delete post', async () => {
    const postId = 'postId';

    MockPostService.findByIdAndDelete.mockReturnValue({
      exec: jest.fn().mockResolvedValue({_id: 'postId'})
    });

    const result = await service.delete(postId);

    expect(result._id).toEqual(postId);
    expect(MockPostService.findByIdAndDelete).toHaveBeenLastCalledWith(postId);
  });

  it('should throw not found exception', async () => {
    const postId = 'postId';

    MockPostService.findByIdAndDelete.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null)
    });

    await expect(service.delete(postId)).rejects.toThrow(NotFoundException);
    expect(MockPostService.findByIdAndDelete).toHaveBeenLastCalledWith(postId);
  });

  it('should find post by id', async () => {
    const postId = 'postId';

    MockPostService.findById.mockResolvedValue({_id: 'postId'});

    const result = await service.find(postId);

    expect(result._id).toEqual(postId);
    expect(MockPostService.findById).toHaveBeenLastCalledWith(postId);
  });

  it('should throw not found exception', async () => {
    const postId = 'postId';

    MockPostService.findById.mockResolvedValue(null);

    await expect(service.find(postId)).rejects.toThrow(NotFoundException);
    expect(MockPostService.findById).toHaveBeenLastCalledWith(postId);
  });

  it('should find post by author and/or title', async () => {
    const filter = {title: 'title', authorId: 'userId'};

    MockPostService.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue([{_id: 'postId', authorId: 'userId', title: 'title'}])
    });

    const result = await service.findAll(filter.authorId, filter.title);

    expect(result[0].authorId).toEqual(filter.authorId);
    expect(result[0].title).toContain(filter.title);
  });

  it('should thron not found exception', async () => {
    const filter = {title: 'title', authorId: 'userId'};

    MockPostService.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue([])
    });

    const result = await service.findAll(filter.authorId, filter.title);

    expect(result).toEqual([]);
  });
});
