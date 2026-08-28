import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt');

const mockUserService = {
  findByEmail: jest.fn()
}

const mockJwtService = {
  signAsync: jest.fn()
}

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks;
  });

  it('should sign in user', async () => {
    const dto = {email: 'test@email.com', password: 'pass1234'};
    const existingUser = {id: 'userId', email: 'test@email.com', password: 'hashedpassword'};
    const fakeToken = 'fakeToken';

    mockUserService.findByEmail.mockResolvedValue(existingUser);
    
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    mockJwtService.signAsync.mockResolvedValue(fakeToken);

    const result = await service.signIn(dto);

    expect(result.access_token).toEqual(fakeToken);
    expect(mockUserService.findByEmail).toHaveBeenCalledWith(dto.email);
    expect(bcrypt.compare).toHaveBeenCalledWith(dto.password, existingUser.password);
    expect(mockJwtService.signAsync).toHaveBeenCalledWith({sub: existingUser.id, email: existingUser.email});
  });

  it('should throw not found exception', async () => {
    const dto = {email: 'test@email.com', password: 'pass1234'};
    const existingUser = {_id: 'userId', email: 'test@email.com', password: 'hashedpassword'};
    const fakeToken = 'fakeToken';

    mockUserService.findByEmail.mockResolvedValue(null);
    
    await expect(service.signIn(dto)).rejects.toThrow(NotFoundException);
    expect(mockUserService.findByEmail).toHaveBeenCalledWith(dto.email);
  });

  it('should throw unauthorized exception', async () => {
    const dto = {email: 'test@email.com', password: 'pass1234'};
    const existingUser = {_id: 'userId', email: 'test@email.com', password: 'hashedpassword'};
    const fakeToken = 'fakeToken';

    mockUserService.findByEmail.mockResolvedValue(existingUser);
    
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(service.signIn(dto)).rejects.toThrow(UnauthorizedException);
    expect(mockUserService.findByEmail).toHaveBeenCalledWith(dto.email);
    expect(bcrypt.compare).toHaveBeenCalledWith(dto.password, existingUser.password);
  });
});
