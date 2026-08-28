import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { AuthGuard } from '../auth/auth.guard';

const mockPostService = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  find: jest.fn(),
  findAll: jest.fn(),
}

describe('PostController', () => {
  let controller: PostController;
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: mockPostService,
        },
      ],
    }).overrideGuard(AuthGuard).useValue({canActivate: () => true}).compile();

    controller = module.get<PostController>(PostController);
    service = module.get<PostService>(PostService);
    jest.clearAllMocks();
  });

  it('should create post', async () => {
    const req = {user: {sub: 'userId'}};
    const dto = {title: 'title', content: 'content'};

    mockPostService.create.mockResolvedValue({_id: 'postId', authorId: req.user.sub, ...dto});

    const result = await controller.create(dto, req);

    expect(result.authorId).toEqual(req.user.sub);
    expect(result.title).toEqual(dto.title);
    expect(result.content).toEqual(dto.content);
    expect(mockPostService.create).toHaveBeenCalledWith(dto, req.user.sub);
  });

  it('should update post', async () => {
    const id = 'postId';
    const dto = {title: 'new title', content: 'new content'};

    mockPostService.update.mockResolvedValue({_id: id, ...dto});

    const result = await controller.update(id, dto);

    expect(result._id).toEqual(id);
    expect(result.title).toEqual(dto.title);
    expect(result.content).toEqual(dto.content);
    expect(mockPostService.update).toHaveBeenCalledWith(id, dto);
  });

  it('should delete post', async () => {
    const id = 'postId';

    mockPostService.delete.mockResolvedValue({_id: id});

    const result = await controller.delete(id);

    expect(result._id).toEqual(id);
    expect(mockPostService.delete).toHaveBeenCalledWith(id);
  });

  it('should get all posts', async () => {
    const authorId = 'userId';
    const title = 'title';
    
    mockPostService.findAll.mockResolvedValue([{authorId, title}]);

    const result = await controller.getAll(authorId, title);

    expect(result[0].authorId).toEqual(authorId);
    expect(result[0].title).toContain(title);
    expect(mockPostService.findAll).toHaveBeenCalledWith(authorId, title);
  });

  it('should create post', async () => {
    const id = 'postId';

    mockPostService.find.mockResolvedValue({_id: id});

    const result = await controller.getById(id);

    expect(result._id).toEqual(id);
    expect(mockPostService.find).toHaveBeenCalledWith(id);
  });
});
