import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';

const mockUserService = {
  create: jest.fn(),
  findByEmail: jest.fn(),
  delete: jest.fn()
};

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{
        provide: UserService,
        useValue: mockUserService,
      },
    ],
    }).overrideGuard(AuthGuard).useValue({canActivate: () => true}).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  it('should create user', async () => {
    const dto = {email: 'test@mail.com', password: 'pass1234'}
    const expected = {email: 'test@mail.com', password: 'hashedpassword', _id: 'userId'};

    mockUserService.create.mockResolvedValue(expected);

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expected);
  });

  it('should delete user', async () => {
    const id = 'userId';

    mockUserService.delete.mockResolvedValue(id);

    const result = await controller.delete(id);

    expect(service.delete).toHaveBeenCalledWith(id);
    expect(result).toEqual(id);
  })
});
