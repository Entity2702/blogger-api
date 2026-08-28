import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, NotFoundException } from '@nestjs/common';

jest.mock('bcrypt');

class MockUserModel {
 constructor(public data: any) {}

 save = jest.fn().mockImplementation(() => Promise.resolve(this.data));

 static findOne = jest.fn();
 static findByIdAndDelete = jest.fn();
}

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: MockUserModel,
        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  it('should create new user', async () => {
    const testUserDto= {email: 'testUser@email.com', password: 'pass1234'};
    const hashedPassword = 'hashedPassword';

    MockUserModel.findOne.mockResolvedValue(null);

    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

    const createdUser = await service.create(testUserDto);

    expect(MockUserModel.findOne).toHaveBeenCalledWith({email: testUserDto.email});
    expect(bcrypt.hash).toHaveBeenCalledWith(testUserDto.password, 10);

    expect(createdUser.email).toBe(testUserDto.email);
    expect(createdUser.password).not.toBe(testUserDto.password);
  });

  it('should throw conflict exception', async () => {
    const testUserDto= {email: 'testUser@email.com', password: 'pass1234'};

    MockUserModel.findOne.mockResolvedValue({email: 'testUser@email.com'});

    await expect(service.create(testUserDto)).rejects.toThrow(ConflictException);
    expect(MockUserModel.findOne).toHaveBeenCalledWith({email: testUserDto.email});
  });

  it('should find user by email', async () => {
    const email = 'testUser@email.com';

    MockUserModel.findOne.mockResolvedValue(email);

    const result = await service.findByEmail(email);

    expect(result).toEqual(email);
    expect(MockUserModel.findOne).toHaveBeenCalledWith({email});
  });

  it('should not find any user', async () => {
    const email = 'testUser@email.com';

    MockUserModel.findOne.mockResolvedValue(null);

    const result = await service.findByEmail(email);

   expect(result).toBe(null);
    expect(MockUserModel.findOne).toHaveBeenCalledWith({email});
  });

  it('should delete user', async () => {
    const id = 'userID';

    MockUserModel.findByIdAndDelete.mockResolvedValue(id);

    const result = await service.delete(id);
    
    expect(result).toBe(id);
    expect(MockUserModel.findByIdAndDelete).toHaveBeenCalledWith(id);
  });

  it('should throw not found exception', async () => {
    const id = 'userID';

    MockUserModel.findByIdAndDelete.mockResolvedValue(null);


    await expect(service.delete(id)).rejects.toThrow(NotFoundException);
    expect(MockUserModel.findByIdAndDelete).toHaveBeenCalledWith(id);
  });
});
