import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
const mockAuthService = {
  signIn: jest.fn()
}

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        }
      ]
    }).overrideGuard(AuthGuard).useValue({canActivate: () => true}).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  it('should sign in user', async () => {
    const dto = {email: 'test@email.com', password: 'pass1234'};
    const expected = 'token';

    mockAuthService.signIn.mockResolvedValue(expected);

    const result = await controller.signIn(dto);

    expect(result).toEqual(expected);
    expect(mockAuthService.signIn).toHaveBeenCalledWith(dto);
  });

  it('should return user', () => {
    const req = {user: 'userObject'};

    const result = controller.getUser(req);

    expect(result).toEqual(req.user);
  })
});
